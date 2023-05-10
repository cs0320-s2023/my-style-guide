import { useState } from "react";

interface SearchBoxProps {
  onSearch: (keyword: string) => void;
}
/**
 * Sets up the search box for front end user functionallity
 */
function SearchBox(props: SearchBoxProps) {
  const [query, setQuery] = useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  /**
   * Handles the submit upon a search entry
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSearch(query);
    setQuery("");
  };

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <input
        role="search-box"
        aria-label="Search box"
        aria-description="Input your search keyword here, followed by clicking the search button or pressing enter"
        type="text"
        placeholder="Enter search keywords here."
        value={query}
        onChange={handleInput}
      />
      <button
        role="button"
        type="submit"
        aria-label="Search button"
        aria-description="Button to be pressed after keyword entered in input box"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBox;
