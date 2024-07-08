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

  const items = results;
  const total = results.length

  const title = Config.results.title;
  const text =
    total < 5
      ? Config.results.textFewResultsPre(total)
      : Config.results.text(total);
  const hint = Config.results.hint;
  const fallbackText = Config.noResultsText;

  if (!!!total) {
    return fallbackText ? (
      <div className="mx-auto p-2 sm:p-4 bg-[#f7f7f7]">
        <p
          className="mt-0 italic text-[13px]"
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
        <span class="underline">${value}</span>
        `
      );
    });

    const markup = optionValues.map((values) => values.join(" oder "));

    return markup.join(" und ").trim() + ".";
  }

  const titleClasses = "p-0 text-base text-lg mt-10";

  const activeOptionsMarkup = getActiveOptionsMarkup(getActiveOptions());

  return (
    <>
      <div className="mx-auto p-2 sm:p-4 bg-[#f7f7f7]">
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
          className="mt-0 italic text-[13px]"
          dangerouslySetInnerHTML={{
            __html: hint,
          }}
        />

        <ProductList
          products={items}
          total={results.length}
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
