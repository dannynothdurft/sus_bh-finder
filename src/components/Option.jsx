function Option({
  option,
  question,
  isSelected,
  toggleOption,
  showImage = true,
  small,
  isWildCartActive = false,
  optionStatus = "initial",
  type,
  showText = true,
}) {
  const shopifyURL = window.assetUrls;

  let inactiveClass = "";

  /**
   * We have various cases how an option can be marked as 'inactive'
   * 1. It's not a wildcard and has no count => completely inactive and can not be clicked
   * 2. It's not a wildcard, has a count and currently the wildcard option is active => it's marked as inactive but can be clicked
   * 3. It's a wildcard option and it's status is 'inactive'
   */
  if (!option.wildcard) {
    if (option.count === 0) {
      inactiveClass = "bh-finder__option--inactive";
    } else if (isWildCartActive) {
      inactiveClass = "bh-finder__option--inactive-wildcard";
    } else if ("inactive" === optionStatus) {
      inactiveClass = "bh-finder__option--inactive-wildcard";
    }
  } else if ("inactive" === optionStatus) {
    inactiveClass = "bh-finder__option--inactive-wildcard";
  }

  return (
    <li
      type={type}
      question={question}
      onClick={() => toggleOption()}
      className={`bh-finder__option ${
        isSelected ? " bh-finder__option--active" : ""
      }
        ${inactiveClass}
          ${small ? " bh-finder__option--small" : ""}

        `}
      bhf-ga4-tid={question}
      bhf-ga4-tse={option.track}
    >
      {showImage ? (
        option.image ? (
          <img
            bhf-ga4-tid={question}
            bhf-ga4-tse={option.track}
            alt={question}
            title={option.title}
            className="bh-finder__optionImage"
            src={`/cdn/shop/t/19/assets/${option.image}`}
          />
        ) : null
      ) : (
        <i
          className="fa fa-times"
          bhf-ga4-tid={question}
          bhf-ga4-tse={option.track}
        />
      )}

      <p
        bhf-ga4-tid={question}
        bhf-ga4-tse={option.track}
        style={{ margin: 0 }}
      >
        {option.title}
      </p>
      {showText ? (
        option.text ? (
          <>
            <div
              style={{ borderTop: "solid black 2px" }}
              bhf-ga4-tid={question}
              bhf-ga4-tse={option.track}
            ></div>

            <p
              className="mt-2 text-left text-base"
              bhf-ga4-tid={question}
              bhf-ga4-tse={option.track}
            >
              {option.text}
            </p>
          </>
        ) : null
      ) : null}
    </li>
  );
}

export default Option;
