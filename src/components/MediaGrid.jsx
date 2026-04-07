import { useEffect, useState } from "react";

const images = [
  "https://i.pinimg.com/736x/91/41/da/9141da71db6df4508b2a41f53957969a.jpg",
  "https://i.pinimg.com/736x/09/0f/48/090f48f8c93ab1203c9d00ade5f38554.jpg",
  "https://i.pinimg.com/1200x/18/cf/0f/18cf0f3223c943c6b6fd6206ef63e489.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg",
  "https://i.pinimg.com/1200x/18/cf/0f/18cf0f3223c943c6b6fd6206ef63e489.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg",
  "https://i.pinimg.com/736x/91/41/da/9141da71db6df4508b2a41f53957969a.jpg",
  "https://i.pinimg.com/736x/09/0f/48/090f48f8c93ab1203c9d00ade5f38554.jpg",
  "https://i.pinimg.com/1200x/18/cf/0f/18cf0f3223c943c6b6fd6206ef63e489.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg",
  "https://i.pinimg.com/1200x/18/cf/0f/18cf0f3223c943c6b6fd6206ef63e489.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg",
  "https://i.pinimg.com/736x/53/7f/c9/537fc9352c9f704ec1b2457005fbd6d4.jpg"
];

export default function MediaGrid() {
  const [gridImages, setGridImages] = useState(images.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      setGridImages((prev) => {
        const newImages = [...images];
        return newImages.sort(() => 0.5 - Math.random()).slice(0, 4);
      });
    }, 2000); // 2 sec me change

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="media-grid">
      {gridImages.map((img, index) => (
        <div className="grid-item" key={index}>
          <img src={img} alt={`grid-${index}`} />
        </div>
      ))}
    </section>
  );
}