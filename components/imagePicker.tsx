import React, { useState } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

export default function ImagePickers() {
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
            setAvatarSource(result.assets[0].uri);
        }
    };

    return (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
            <TouchableOpacity onPress={handleGalleryClick} style={{ padding: 10, backgroundColor: '#007BFF', borderRadius: 5 }}>
                <Text style={{ color: 'white' }}>Open Gallery</Text>
            </TouchableOpacity>

            {avatarSource && (
                <Image
                    source={{ uri: avatarSource }}
                    style={{ width: 200, height: 200, marginTop: 20, borderRadius: 10 }}
                />
            )}
        </View>
    );
}
