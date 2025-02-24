from rest_framework import serializers
from django.conf import settings
from .models import CustomUser, Message

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password', 'profile_picture']

    def create(self, validated_data):
        """Override create method to hash password before saving."""
        profile_picture = validated_data.pop('profile_picture', None)  # Handle profile picture
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hash password
        if profile_picture:
            user.profile_picture = profile_picture  # Save profile picture
        user.save()
        return user

class UpdateProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture']

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'

    def get_file_url(self, obj):
        """Return absolute file URL or None if no file is attached."""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return f"{settings.MEDIA_URL}{obj.file.name}"  # Fallback without request
        return None
