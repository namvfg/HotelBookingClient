const features = [
  "Đặt phòng nhanh chóng",
  "Giá cả minh bạch",
  "Hỗ trợ 24/7",
];

const WhyChooseUs = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-10">
          Vì sao chọn chúng tôi?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <div className="text-blue-600 text-3xl mb-4">✔</div>
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
