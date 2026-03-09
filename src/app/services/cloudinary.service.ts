import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  // Cloudinary configuration
  // Get these from: https://cloudinary.com/console
  private readonly cloudName = (environment as any).cloudinary?.cloudName || 'your-cloud-name';
  private readonly uploadPreset = (environment as any).cloudinary?.uploadPreset || 'your-upload-preset';
  private readonly uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor() {}

  /**
   * Upload image to Cloudinary
   * @param file - Image file to upload
   * @returns Promise with uploaded image URL
   */
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    formData.append('folder', 'car-app'); // Organize images in a folder

    try {
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed: ' + response.statusText);
      }

      const data = await response.json();
      
      return {
        url: data.secure_url,
        publicId: data.public_id,
        format: data.format
      };
    } catch (error: any) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image: ' + error.message);
    }
  }

  /**
   * Upload multiple images
   * @param files - Array of image files
   * @returns Promise with array of uploaded URLs
   */
  async uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Get Cloudinary image URL with transformations
   * @param publicId - The public ID of the image
   * @param transformations - Optional transformations (width, height, crop, etc.)
   * @returns Transformed image URL
   */
  getImageUrl(publicId: string, transformations?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }): string {
    let url = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;
    
    if (transformations) {
      const transforms: string[] = [];
      if (transformations.width) transforms.push(`w_${transformations.width}`);
      if (transformations.height) transforms.push(`h_${transformations.height}`);
      if (transformations.crop) transforms.push(`c_${transformations.crop}`);
      if (transformations.quality) transforms.push(`q_${transformations.quality}`);
      
      if (transforms.length > 0) {
        url += transforms.join(',') + '/';
      }
    }
    
    url += publicId;
    return url;
  }

  /**
   * Delete image from Cloudinary (requires server-side API with API key)
   * This is a placeholder - actual deletion requires backend
   * @param publicId - The public ID of the image to delete
   */
  async deleteImage(publicId: string): Promise<void> {
    console.warn('Image deletion requires server-side implementation with Cloudinary API key');
    // Implementation requires backend with Cloudinary API key/secret
    // Example backend endpoint would call:
    // cloudinary.v2.uploader.destroy(publicId, callback);
  }
}
