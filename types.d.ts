declare module "@/lib/uploadToCloudinary" {
  export function uploadToCloudinary(file: File): Promise<string>;
}
