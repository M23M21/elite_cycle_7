import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Solent E Stores</h1>
          <p className="text-2xl mb-4">Your one-stop shop for premium cycling gear</p>
          <Link href="/products" legacyBehavior>
            <a className="px-8 py-3 bg-blue-500 text-white text-lg rounded hover:bg-blue-700">
              Shop Now
            </a>
          </Link>
        </div>
      </div>
      <div className="relative flex-grow h-48">
        <Image
          src="/images/first page.jpeg"
          alt="Background image"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
        />
      </div>
    </div>
  );
};

export default HomePage;
