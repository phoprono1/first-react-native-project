import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.jsm.aora",
    projectId: "66750bda002a12332f8c",
    databaseId: "66750e7a00219c378c60",
    userCollectionId: "66750f810023f8ef27bd",
    videoCollectionId: "66750fb90002d9d7cb92",
    storageId: "6677dfa900272de82353",
};

const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async(email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        );

        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(), {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl,
            }
        );

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

export const signIn = async(email, password) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export const getCurrentUser = async() => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId, [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
};

export const getAllPosts = async() => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt"),
        ]);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            thumbnail: doc.thumbnail,
            prompt: doc.prompt,
            video: doc.video,
            creator: doc.creator,
        }));
    } catch (error) {
        throw new Error(error);
    }
};

export const getLatestPosts = async() => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt", Query.limit(7)),
        ]);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            thumbnail: doc.thumbnail,
            prompt: doc.prompt,
            video: doc.video,
            creator: doc.creator,
        }));
    } catch (error) {
        throw new Error(error);
    }
};

export const searchPosts = async(query) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.search("title", query),
        ]);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            thumbnail: doc.thumbnail,
            prompt: doc.prompt,
            video: doc.video,
            creator: doc.creator,
        }));
    } catch (error) {
        throw new Error(error);
    }
};

export const getUserPosts = async(userId) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.equal("creator", userId),
        ]);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            thumbnail: doc.thumbnail,
            prompt: doc.prompt,
            video: doc.video,
            creator: doc.creator,
        }));
    } catch (error) {
        throw new Error(error);
    }
};

export const signOut = async() => {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

export const getFilePreview = async(fileId, type) => {
    let fileUrl;
    try {
        if (type === "video") {
            fileUrl = storage.getFilePreview(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                "top",
                100
            );
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw new Error();
        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const uploadFile = async(file, type) => {
    if (!file) return;
    const { mimeType, ...rest } = file;
    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        );

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const createVideo = async(form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(), {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
        s;
    } catch (error) {
        throw new Error(error);
    }
};