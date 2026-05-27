"use client"

import { HttpTypes } from "@medusajs/types"
import { Container, clx } from "@medusajs/ui"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageId, setSelectedImageId] = useState<string>(
    images[0]?.id || ""
  )

  const selectedImage = images.find((i) => i.id === selectedImageId) || images[0]

  return (
    <div className="flex items-start relative w-full h-full">
      {/* Thumbnails Floating on the left */}
      {images.length > 1 && (
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-y-2">
          {images.map((image) => {
            return (
              <button
                key={image.id}
                onClick={() => setSelectedImageId(image.id)}
                className={clx(
                  "relative w-16 h-20 rounded-md overflow-hidden border-2 transition-all shadow-sm",
                  {
                    "border-black scale-100": selectedImageId === image.id,
                    "border-transparent opacity-70 hover:opacity-100 scale-95 hover:scale-100": selectedImageId !== image.id,
                  }
                )}
              >
                {!!image.url && (
                  <Image
                    src={image.url}
                    alt={`Thumbnail`}
                    fill
                    sizes="64px"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Main Image */}
      <Container
        className="relative aspect-[29/34] w-full overflow-hidden bg-ui-bg-subtle rounded-3xl"
        id={selectedImage?.id}
      >
        {!!selectedImage?.url && (
          <Image
            src={selectedImage.url}
            priority={true}
            className="absolute inset-0"
            alt={`Product main image`}
            fill
            sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </Container>
    </div>
  )
}

export default ImageGallery
