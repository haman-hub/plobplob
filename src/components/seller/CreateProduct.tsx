import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Globe } from 'lucide-react';
import { mockDB } from '../../services/mockDatabase';

const CATEGORIES = [
  { id: 'ebooks', name: 'eBooks' },
  { id: 'tutorials', name: 'Tutorials' },
  { id: 'assets', name: 'Digital Assets' },
  { id: 'software', name: 'Software' },
  { id: 'courses', name: 'Courses' },
  { id: 'music', name: 'Music' },
  { id: 'art', name: 'Digital Art' },
  { id: 'templates', name: 'Templates' },
];

const CreateProduct: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'ebooks',
    hiddenLink: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = mockDB.getCurrentUser();
    if (!user) {
      navigate('/');
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.price || !formData.hiddenLink) {
      alert('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      setIsSubmitting(false);
      return;
    }

    // Create product
    const product = mockDB.createProduct({
      title: formData.title,
      description: formData.description,
      price: price,
      category: formData.category,
      hiddenLink: formData.hiddenLink,
      sellerId: user.id,
    });

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Product created successfully!');
      navigate('/seller/dashboard');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Advanced React Patterns eBook"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe your product in detail..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none resize-none"
            required
          />
        </div>

        {/* Price & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (TON) *
            </label>
            <div className="relative">
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.1"
                min="0.1"
                placeholder="10.0"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                TON
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hidden Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Download Link *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="url"
              name="hiddenLink"
              value={formData.hiddenLink}
              onChange={handleChange}
              placeholder="https://drive.google.com/your-file-link"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0088cc] focus:border-transparent outline-none"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This link will be automatically delivered to buyers after purchase
          </p>
        </div>

        {/* Pricing Info */}
        <div className="bg-blue-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Pricing Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">You receive:</span>
              <span className="font-medium">
                {formData.price ? `${parseFloat(formData.price).toFixed(2)} TON` : '0.00 TON'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform fee:</span>
              <span className="font-medium">0.10 TON</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold">Buyer pays:</span>
              <span className="font-bold text-[#0088cc]">
                {formData.price ? `${(parseFloat(formData.price) + 0.1).toFixed(2)} TON` : '0.10 TON'}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-[#0088cc] to-blue-600 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Creating Product...</span>
            </div>
          ) : (
            <>
              <Upload className="w-5 h-5 inline mr-2" />
              Create Product
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;