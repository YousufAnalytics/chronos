import "./SearchBox.css"

const TraceSearch = () => {
  return (
    <div className="trace-search">
      <input
        type="text"
        placeholder="Search traces by service, operation, trace id…"
        disabled
      />
    </div>
  );
};

export default TraceSearch;
