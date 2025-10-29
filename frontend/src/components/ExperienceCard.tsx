import { Link } from 'react-router-dom';
import { Experience } from '../api';

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard = ({ experience }: ExperienceCardProps) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.image_url}
          alt={experience.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Location */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{experience.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{experience.location}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {experience.description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">From </span>
            <span className="text-xl font-bold text-gray-900">₹{experience.price}</span>
          </div>
          <Link
            to={`/experience/${experience.id}`}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-black font-medium rounded-lg transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
