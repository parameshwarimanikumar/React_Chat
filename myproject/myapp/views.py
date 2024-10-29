# views.py
import logging
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .models import CustomUser, Message
from .serializers import UserSerializer, UpdateProfilePictureSerializer, MessageSerializer

# Set up logging
logger = logging.getLogger(__name__)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, user_id):
    logger.info(f"User {request.user} is trying to access messages with user_id: {user_id}")
    
    if not request.user.is_authenticated:
        return Response({'error': 'User not authenticated.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        CustomUser.objects.get(id=user_id)
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver_id=user_id)) |
            (Q(sender_id=user_id) & Q(receiver=request.user))
        ).order_by('timestamp')
        
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except CustomUser.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user
    receiver_id = request.data.get('recipient_id')
    content = request.data.get('content')
    file = request.FILES.get('file')

    if not receiver_id or not (content or file):
        return Response({'error': 'Receiver and message body or file are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        receiver = CustomUser.objects.get(id=receiver_id)
        message = Message.objects.create(sender=sender, receiver=receiver, content=content, file=file)
        serializer = MessageSerializer(message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except CustomUser.DoesNotExist:
        return Response({'error': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    user = request.user
    serializer = UpdateProfilePictureSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile picture updated successfully',
            'profile_picture_url': request.build_absolute_uri(user.profile_picture.url)
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_list(request):
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    logger.info(f"Request made by user: {request.user} (Authenticated: {request.user.is_authenticated})")

    serializer = UserSerializer(request.user, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)
