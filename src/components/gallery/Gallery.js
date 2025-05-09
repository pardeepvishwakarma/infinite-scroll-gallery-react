import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './Gallery.scss';

const API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;

/**
 *
 *
 * @return {*} 
 */
const Gallery = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const observer = useRef();

  const lastImageRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    if (!query) return;

    /**
     *
     *
     */
    const fetchImages = async () => {
      setLoading(true);
      const res = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&page=${page}&per_page=20`);
      console.log(res);
      setImages((prev) => [...prev, ...res.data.hits]);
      setLoading(false);
    };

    fetchImages();
  }, [query, page]);

  /**
   * function clear image array, update page count and search input
   *
   * @param {*} e
   * @param {boolean} [isButtonSearch=false]
   */
  const handleSearch = (e, isButtonSearch = false) => {
    if (query === searchInput) return;
    if (e?.key === 'Enter' || isButtonSearch) {
      setImages([]);
      setPage(1);
      setQuery(searchInput);
    }
  };

  return (
    <div className="container">
      <div className="search-container">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search images..."
        />
        <button className="search-btn" onClick={() => handleSearch(null, true)}>Search</button>
      </div>

      <div className="gallery">
        {images.map((img, index) => (
          <div
            className="image-card"
            key={img.id}
            ref={index === images.length - 1 ? lastImageRef : null}
          >
            <img src={img.previewURL} alt="img" onClick={() => setSelectedImage(img)} />
          </div>
        ))}
      </div>

      {loading && <div className="loader">Loading...</div>}

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage.largeImageURL} alt="large" />
        </div>
      )}
    </div>
  );
};

export default Gallery;
