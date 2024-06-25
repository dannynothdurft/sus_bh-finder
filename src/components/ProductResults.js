import React from "react";
import ProductList from "./ProductList";
import { Element } from "react-scroll";
import Config from "../lang/configDE";

function ProductResults({
  results = {
    items: [],
    total: 0,
  },
  show = false,
  currentPage = 1,
  name = "",
  setPage,
  selectedOptions = [],
  sizeConfigurations = [],
  currencySign,
}) {
  if (!show) return <Element name={name} />;

  const { items, total } = results;

  const title = Config.results.title;
  const text =
    total < 5
      ? Config.results.textFewResultsPre(total)
      : Config.results.text(total);
  const hint = Config.results.hint;
  const fallbackText = Config.noResultsText;

  if (!!!total) {
    return fallbackText ? (
      <div className="bh-finder__productListWrapper">
        <p
          className="bh-finder__hint"
          dangerouslySetInnerHTML={{
            __html: fallbackText,
          }}
        />
      </div>
    ) : null;
  }

  function getActiveOptions() {
    if (selectedOptions.length) {
      let activeOptions = [];

      const selectedSizes = sizeConfigurations.reduce((arr, el) => {
        const sizes = el?.filterSizes.map((size) => {
          return size.replace(" | ", "/");
        });

        arr.push(...sizes);

        return arr;
      }, []);

      if (selectedSizes.length) {
        activeOptions.push(selectedSizes);
      }

      const reducedActiveOptions = selectedOptions.reduce((arr, el) => {
        const options = el?.options.filter(
          (option) => option.status === "active"
        );
        if (options?.length) {
          arr.push(options.map((option) => option.title));
        }
        return arr;
      }, []);

      activeOptions.push(...reducedActiveOptions);

      return activeOptions;
    }

    return [];
  }

  function getActiveOptionsMarkup(activeOptions = []) {
    const optionValues = activeOptions.map((activeOption) => {
      return activeOption.map(
        (value) => `
        <span class="bh-finder__productListWrapper-option">${value}</span>
        `
      );
    });

    const markup = optionValues.map((values) => values.join(" oder "));

    return markup.join(" und ").trim() + ".";
  }

  const titleClasses = "bh-finder__welcomeText bh-finder__otherResultsTitle";

  const activeOptionsMarkup = getActiveOptionsMarkup(getActiveOptions());

  return (
    <>
      <div className="bh-finder__productListWrapper">
        <Element name={name} />
        <p
          className={titleClasses}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />

        <p
          dangerouslySetInnerHTML={{
            __html: text.concat(activeOptionsMarkup),
          }}
        />

        {total < 5 && <p>{Config.results.textFewResultsPost}</p>}

        <p
          className="bh-finder__hint"
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        />

        <ProductList
          products={items}
          total={total}
          currentPage={currentPage}
          paginate={(page) => {
            setPage(page);
          }}
          currencySign={currencySign}
        />
      </div>
    </>
  );
}

export default ProductResults;
