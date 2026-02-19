import React from 'react';

export default function AboutPage() {
    return (
        <main className="max-w-4xl mx-auto py-16 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center">About Arb Yacht</h1>
            <div className="flex flex-col md:flex-row gap-8 items-center mb-10">
                <img
                    src="/gallery/yacht-exterior.jpeg"
                    alt="Yacht Exterior"
                    className="rounded-lg shadow-lg w-full md:w-1/2 object-cover h-72"
                />
                <div>
                    <p className="mb-4 text-lg">
                        <span className="font-semibold">Arb Yacht</span> is your gateway to luxury yachting experiences in Dubai. Our mission is to deliver unforgettable moments on the water, blending elegance, adventure, and personalized service.
                    </p>
                    <p className="mb-4 text-lg">
                        With a fleet of modern yachts and a dedicated crew, we cater to private charters, family getaways, corporate events, and special celebrations. Every journey is tailored to your desires, ensuring comfort, safety, and joy.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Our Values</h2>
                    <ul className="list-disc pl-6 text-lg text-gray-700">
                        <li>Exceptional hospitality and service</li>
                        <li>Attention to detail in every experience</li>
                        <li>Commitment to safety and comfort</li>
                        <li>Creating lifelong memories for our guests</li>
                    </ul>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
                    <ul className="list-disc pl-6 text-lg text-gray-700">
                        <li>Modern, well-equipped yachts</li>
                        <li>Experienced and friendly crew</li>
                        <li>Customizable packages for every occasion</li>
                        <li>Stunning routes and breathtaking views</li>
                    </ul>
                </div>
            </div>
            <div className="mt-10 text-center">
                <img
                    src="/gallery/interior.jpeg"
                    alt="Yacht Interior"
                    className="inline-block rounded-lg shadow-lg w-full max-w-md object-cover h-64"
                />
                <p className="mt-4 text-lg text-gray-600">Step inside our yachts and discover a world of luxury, comfort, and style.</p>
            </div>
        </main>
    );
}
