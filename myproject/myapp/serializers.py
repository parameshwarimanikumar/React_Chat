from rest_framework import serializers
from .models import CustomUser, Message

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'sender', 'receiver']

class UpdateProfilePictureSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['profile_picture', 'profile_picture_url']

    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if request is not None and obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url)
        elif request is not None:
            # Return a default profile picture URL if there's no profile picture set
            return request.build_absolute_uri('/media/default_profile_picture.jpg')
        return None

class UserSerializer(serializers.ModelSerializer):
    profile_picture_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_picture', 'profile_picture_url']

    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if request is not None and obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url)
        elif request is not None:
            # Return a default profile picture URL if there's no profile picture set
            return request.build_absolute_uri('/media/default_profile_picture.jpg')
        return None
