import logging
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Message
from .serializers import UserSerializer, UpdateProfilePictureSerializer, MessageSerializer

logger = logging.getLogger(__name__)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Handles user login and returns JWT tokens."""
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        logger.warning("Login attempt with missing credentials.")
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        logger.warning(f"Login attempt for unregistered email: {email}")
        return Response({'error': 'Please register first.'}, status=status.HTTP_404_NOT_FOUND)

    user = authenticate(request, email=email, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        logger.info(f"User {email} logged in successfully.")
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        }, status=status.HTTP_200_OK)

    logger.warning(f"Invalid login attempt for email: {email}")
    return Response({'error': 'Email or password mismatch.'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    """Handles user registration."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(f"New user registered: {serializer.validated_data['email']}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    logger.warning(f"User registration failed: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_list(request):
    """Returns a list of all registered users."""
    users = CustomUser.objects.all()
    serializer = UserSerializer(users, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Returns the authenticated user's details."""
    user = request.user
    return Response({
        'username': user.username,
        'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, user_id):
    """Fetch messages between the authenticated user and another user."""
    try:
        other_user = CustomUser.objects.get(id=user_id)
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=request.user))
        ).order_by('timestamp')

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except CustomUser.DoesNotExist:
        logger.error(f"User with ID {user_id} not found.")
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.exception("Error fetching messages")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    """Handles sending messages between users."""
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

        logger.info(f"Message sent from {sender.email} to {receiver.email}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except CustomUser.DoesNotExist:
        return Response({'error': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        logger.exception("Error sending message")
        return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    """Handles updating a user's profile picture."""
    user = request.user

    if 'profile_picture' not in request.FILES:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    profile_picture = request.FILES['profile_picture']
    allowed_types = ['image/jpeg', 'image/png']
    max_size = 2 * 1024 * 1024  # 2MB

    if profile_picture.content_type not in allowed_types:
        return Response({'error': 'Invalid file type. Only JPG and PNG are allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    if profile_picture.size > max_size:
        return Response({'error': 'File too large. Max size is 2MB.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UpdateProfilePictureSerializer(user, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Profile picture updated successfully',
            'profile_picture_url': request.build_absolute_uri(user.profile_picture.url)
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
