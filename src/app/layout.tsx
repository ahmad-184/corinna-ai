import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const jakarta_font = Plus_Jakarta_Sans({
  display: "swap",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Corinna AI",
  description: "An AI powered sales assistant chatbot",
  icons: {
    icon: {
      url: "/favicon.png",
    },
  },
};

export const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${jakarta_font.className} antialiased`}>
        <Providers
          cloudinary_api_key={process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!}
          cloudinary_cloud_name={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}
          cloudinary_preset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!}
          cloudinary_upload_folder={
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER!
          }
        >
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
