import Image from "next/image";
import { ShoeArt } from "./shoe-art";

type Props = {
    src?: string;
    alt: string;
    slug: string;
    sizes: string;
    priority?: boolean;
};

export function ProductImage({ src, alt, slug, sizes, priority }: Props) {
    return (
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    preload={priority}
                    loading={priority ? "eager" : undefined}
                    fetchPriority={priority ? "high" : undefined}
                    className="object-cover"
                />
            ) : (
                <ShoeArt seed={slug} />
            )}
        </div>
    );
}

// import Image from "next/image";
// import { ShoeArt } from "./shoe-art";
//
// type Props = {
//     src?: string;
//     alt: string;
//     slug: string;
//     sizes: string;
//     priority?: boolean;
// };
//
// export function ProductImage({ src, alt, slug, sizes, priority }: Props) {
//     return (
//         <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-2">
//             {src ? (
//                 <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
//             ) : (
//                 <ShoeArt seed={slug} />
//             )}
//         </div>
//     );
// }