import { useState } from 'react';
import PropTypes from 'prop-types';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('name');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm, searchType);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="row g-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-select"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="name">Recipe Name</option>
                        <option value="cuisine">Cuisine</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">Search</button>
                </div>
            </div>
        </form>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchBar;