import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Image, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export default function ImagePickers(
    {profile, setProfile} : {profile: any, setProfile: (newProfile: any) => void}
) {
    const [avatarSource, setAvatarSource] = useState(null);

    const handleGalleryClick = async () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.errorMessage) {
            console.log('ImagePicker Error: ', result.errorMessage);
        } else if (result.assets && result.assets.length > 0) {
            setProfile(result.assets[0].uri);
        }
    };

    const requestPermission = async () => {
        const result = await request(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
                : PERMISSIONS.IOS.PHOTO_LIBRARY,
        );
        if (result !== RESULTS.GRANTED) {
            alert('Permission requise pour accéder à la galerie.');
        }
    };

    useEffect(() => {
        (async () => {
            requestPermission();
        })()
    }, [])

    return (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
            <TouchableOpacity onPress={handleGalleryClick} style={{ padding: 10, backgroundColor: '#007BFF', borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Open Gallery</Text>
            </TouchableOpacity>

            {profile && (
                <Image
                    source={{ uri: profile }}
                    style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
                />
            )}
        </View>
    );
}
