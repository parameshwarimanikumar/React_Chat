from django.urls import path
from .views import (
    login_user,
    create_user,
    get_messages,
    send_message,
    update_profile_picture,
    user_list,
    current_user,
)

urlpatterns = [
    path('login/', login_user, name='login'),
    path('register/', create_user, name='register'),
    path('messages/<int:user_id>/', get_messages, name='get_messages'),
    path('send-message/', send_message, name='send_message'),
    path('update-profile-picture/', update_profile_picture, name='update_profile_picture'),
    path('users/', user_list, name='user_list'),
    path('current-user/', current_user, name='current_user'),
]
