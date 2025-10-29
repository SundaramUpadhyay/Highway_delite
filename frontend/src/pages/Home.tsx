import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { experiencesAPI, Experience } from '../api';
import ExperienceCard from '../components/ExperienceCard';

const Home = () => {
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const search = searchParams.get('search') || '';
        const data = await experiencesAPI.getAll(search);
        setExperiences(data);
      } catch (err) {
        setError('Failed to load experiences. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Discover Amazing Experiences
        </h1>
        <p className="text-gray-600">
          Book curated small-group adventures with certified guides
        </p>
      </div>

      {/* Experiences Grid */}
      {experiences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No experiences found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
