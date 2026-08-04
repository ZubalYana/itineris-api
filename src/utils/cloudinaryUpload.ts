import cloudinary from "../config/cloudinary.config.js";

export function streamUpload(buffer: Buffer): Promise<string>{
    return new Promise((resolve, reject)=>{
        const stream = cloudinary.uploader.upload_stream(
            (error, result)=>{
                if(error) return reject(error);
                resolve(result!.secure_url)
            }
        )
        stream.end(buffer)
    })
}

