import React, { useState, useEffect } from "react";
import { scroller } from "react-scroll";
import Config from "../lang/configDE";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { incrementStep1, incrementStep2 } from "../redux/reducers/steps";
import { incrementSize } from "../redux/reducers/size";

// Components
import StartInfo from "./StartInfo";
import Question from "./Question";
import QuestionReview from "./QuestionReview";
import ProductResults from "./ProductResults";
import ActionInfoBar from "./ActionInfoBar";
import RestartBar from "./RestartBar";
import AdditionalProductResults from "./AdditionalProductResults";

function BHFinder() {
  const imageMobile = "bh-finder_header_small.jpg";
  const imageDesktop = "bh-finder_header_large.jpg";
  const currencySign = "€";

  const dispatch = useDispatch();
  const { step1, step2 } = useSelector((state) => state.steps);
  const { sizes } = useSelector((state) => state.sizes);
  const { filterSize } = useSelector((state) => state.filter);
  const hasSelectedSizes = filterSize ? true : false;

  console.log(step1)

  //? Dieser Abschnitt ruft alle "Bra"-Produkttypen von Shopify ab. Anschließend wird ein Objekt erstellt, in dem jede Größe einmal aufgeführt ist.
  useEffect(() => {
    if (!sizes) {
      const getSizes = async () => {
        try {
          const response = await fetch(
            "https://stage-sugarshape.myshopify.com/api/2024-04/graphql.json",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token":
                  "5e8b64b606882684e55576344b3c9c6d",
              },
              body: JSON.stringify({
                query: `
              query {
                products(first: 250, query: "product_type:bra OR product_type:bra.body OR product_type:bra.bralette OR product_type:bra.sport OR product_type:bra.swim") {
                  edges {
                    node {
                      id
                      title
                      productType
                      variants(first: 200) {
                        edges {
                          node {
                            id
                            title
                            selectedOptions {
                              name
                              value
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
              }),
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          const products = result.data.products.edges;

          const sizeMap = {};

          products.forEach(({ node: product }) => {
            product.variants.edges.forEach(
              ({ node: variant }) => {
                variant.selectedOptions.forEach((option) => {
                  if (
                    option.name.toLowerCase() === "size" ||
                    option.name.toLowerCase() === "größe"
                  ) {
                    const match = option.value.match(
                      /^(\d+\/\d+)\s+\(([\w\s]+)\)$/
                    );

                    if (match && match.length === 3) {
                      const [sizePart, cupPart] = match[1].split("/");

                      const key = `${sizePart} | ${cupPart}`;
                      const value = match[2];

                      sizeMap[key] = value;
                    }
                  }
                });
              }
            );
          });

          dispatch(incrementSize(sizeMap));
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };

      getSizes();
    }
  }, [sizes, dispatch]);

  const getArticels = async () => {
    try {
      const response = await fetch(
        "https://stage-sugarshape.myshopify.com/api/2024-04/graphql.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token":
              "5e8b64b606882684e55576344b3c9c6d",
          },
          body: JSON.stringify({
            query: `
            query searchProducts($productFilters: [ProductFilter!]!) {
              search(
                query: "",
                first: 250,
                types: PRODUCT,
                productFilters: $productFilters
              ) {
                edges { node { ... on Product { id, title } } }
                totalCount
              }
            }
          `,
            variables: {
              productFilters: [
                {
                  variantMetafield: {
                    namespace: "bhs",
                    key: "groesse",
                    value: filterSize,
                  },
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      dispatch(incrementStep1(result.data.search));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  //! Das muss alles bearbeitet werden!!
  const getInitIalOptions = () =>
    Config.questions.map((question) => {
      return {
        id: question.id,
        options: question.options.map((option) => {
          return {
            title: option.title,
            status: "initial",
            wildcard: option.wildcard,
          };
        }),
      };
    });

  const [selectedOptions, setSelectedOptions] = useState(getInitIalOptions());
  const [visibleQuestions, setVisibleQuestions] = useState(
    Config.questions.filter((item) => item.show).map((item) => item.id)
  );
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [showResults, setShowResults] = useState(false);

  // results
  const [results, setResults] = useState({});
  const [attributeResults, setAttributeResults] = useState({});
  const [notRecommendedResults, setNotRecommendedResults] = useState({});
  const [filterAttributeResults, setFilterAttributeResults] = useState({});

  // for pagination
  const [resultsPage, setResultsPage] = useState(1);
  const [attributesResultsPage, setAttributesResultsPage] = useState(1);
  const [notRecommendedPage, setNotRecommendedPage] = useState(1);

  // for sizes
  const [showTwoSizeSelectors, setShowTwoSizeSelectors] = useState(false);

  const [activeSizeConfig, setActiveSizeConfig] = useState(null);
  const [lastSelectedSecondSize, setLastSelectedSecondSize] = useState("");
  const [sizeConfigurations, setSizeConfigurations] = useState([]);

  const [isSusSizeType, setIsSusSizeType] = useState(true);

  const scrollOptions = {
    duration: 400,
    isDynamic: true,
    smooth: true,
    offset: 0,
  };

  /*
  const getAggregations = (field = "attributes") => {
    return Config.questions
      .flatMap((question) => {
        return question.options.flatMap((option) =>
          selectedOptions
            .find((item) => item.id === question.id)
            .options.find((item) => item.title === option.title).status ===
          "active"
            ? option[field]
            : null
        );
      })
      .filter((x) => x)
      .reduce((acc, curVal) => {
        if (!acc[curVal.name]) {
          acc[curVal.name] = [];
        }

        if (!acc[curVal.name].includes(curVal.value)) {
          acc[curVal.name].push(curVal.value);
        }
        return acc;
      }, {});
  };

  const aggregationsToCustomFilter = (attributes, aggregations) => {
    return attributes.reduce((acc, curVal) => {
      if (aggregations[curVal.name]) {
        acc.push({
          attribute: curVal.id,
          operator: "eq",
          value: aggregations[curVal.name],
        });
      }
      return acc;
    }, []);
  };

  const setNewResults = (response, oldResults, setNewResults) => {
    let newResults = response?.product;

    if (response?.product?.offset > oldResults?.offset) {
      newResults.items = oldResults.items.concat(newResults.items);
    }

    setNewResults(newResults);
  };

  */

  /**
   * After specific changes we want to fetch new results
   */
  // useEffect(() => {
  //   setHasSelectedSizes(
  //     sizeConfigurations.some((size) => size.filterSizes.length)
  //   );
  // }, [sizeConfigurations]);

  // useEffect(() => {
  //   let aggregations = getAggregations("attributes");

  //   const constraints = {
  //     "query.shop_id": 1,
  //     "query.language": queryLanguage,
  //     "query.use_stock": false,
  //   };

  //   const body = {
  //     aggregations: [],
  //     constraints,
  //     isSearch: false,
  //     enableAggregations: true,
  //     apiVersion: "2019.9.0-RC1",
  //     count: "final" === currentQuestion ? Config.pageSize : 0,
  //     offset: (resultsPage - 1) * Config.pageSize,
  //     searchPhrase: null,
  //   };

  //   /**
  //    *
  //    * @returns {{not: *[], or: *[], and: *[]}}
  //    */
  //   const getCustomFiltersForResults = () => {
  //     const customAndProduktAttributes = aggregationsToCustomFilter(
  //       Config.productAttributes,
  //       aggregations
  //     );

  //     const constomAndMaterialAttributes = aggregationsToCustomFilter(
  //       Config.materialAttributes,
  //       aggregations
  //     );

  //     const customOrStyleAttributes = aggregationsToCustomFilter(
  //       Config.andAttributes,
  //       aggregations
  //     );

  //     // const customExcludeFilterBlock = aggregationsToCustomFilter(
  //     //   Config.andAttributes,
  //     //   excludes
  //     // );

  //     // const customVariantAndFilterBlock = aggregationsToCustomFilter(
  //     //   Config.variantAndAttributes,
  //     //   aggregations
  //     // );

  //     return {
  //       and: [
  //         ...Config.defaultFilter,
  //         ...customAndProduktAttributes,
  //         ...constomAndMaterialAttributes,
  //       ],
  //       or: [...customOrStyleAttributes],
  //       not: [],
  //     };
  //   };

  //   /**
  //    *
  //    * @param name
  //    * @param body
  //    * @param productFilter
  //    * @param variantFilter
  //    * @returns {Promise<*>}
  //    */
  //   async function doRequest(name, body, productFilter, variantFilter) {
  //     return await httpClient.post(
  //       {
  //         ...body,
  //         customFilter: {
  //           "makaira-productgroup": { ...productFilter }, //? Hier sind die Filter drin
  //           "makaira-product": { ...variantFilter },
  //         },
  //       },
  //       name
  //     );
  //   }

  //   /**
  //    * We do multiple requests to fetch several result lists
  //    * 1. products match all filters and size
  //    * 2. products match the attributes (question 2) and size
  //    * 3. products match material (question 3) and size
  //    * 4. products are beach fashion products
  //    * @returns {Promise<void>}
  //    */
  //   async function fetchResults() {
  //     const sizeAttribute = Config.variantAndAttributes.find(
  //       (item) => item.name === "mak_bh_size"
  //     );

  //     const sizeBlock = {
  //       attribute: sizeAttribute.id,
  //       operator: "eq",
  //       value: [],
  //     };

  //     sizeConfigurations.forEach((size) => {
  //       size.filterSizes.forEach((filterSize) =>
  //         sizeBlock.value.push(filterSize)
  //       );
  //     });

  //     // 1. Result
  //     // Products that match filter and size
  //     const productFilter = getCustomFiltersForResults();
  //     const variantFilter = {
  //       and: [
  //         {
  //           field: "stock",
  //           operator: "gt",
  //           value: 0,
  //         },
  //       ],
  //     };

  //     if (hasSelectedSizes) {
  //       variantFilter.and.push(sizeBlock);
  //     }

  //     const response = await doRequest(
  //       "1. Result",
  //       body,
  //       productFilter,
  //       variantFilter
  //     );

  //     setNewResults(response, results, setResults);

  //     // To save bandwidth we can skip fetching result 2. and 3. sometimes
  //     if (showResults && hasSelectedSizes) {
  //       if (isOneSelected()) {
  //         function modifyObjectRecom(obj) {
  //           let modifiedObjectRecom = JSON.parse(JSON.stringify(obj));

  //           modifiedObjectRecom.and.forEach((item, index) => {
  //             if (item.value.includes("Top Recommended")) {
  //               item.value = ["Not Recommended"];
  //               modifiedObjectRecom.not.push(item);
  //               delete modifiedObjectRecom.and[index];
  //             }
  //           });

  //           modifiedObjectRecom.and = modifiedObjectRecom.and.filter(Boolean);

  //           return modifiedObjectRecom;
  //         }

  //         let modifyObjectRecommended = modifyObjectRecom(productFilter);

  //         const recommendedFilter = modifyObjectRecommended;

  //         const newAttributeResults = await doRequest(
  //           "4. RECOMMENDED",
  //           { ...body, offset: (attributesResultsPage - 1) * Config.pageSize },
  //           recommendedFilter,
  //           variantFilter
  //         );

  //         setNewResults(
  //           newAttributeResults,
  //           attributeResults,
  //           setAttributeResults
  //         );
  //       }

  //       //! 4. Not Recommended
  //       //! Funktion zum Ändern der Werte
  //       function modifyObjectNot(obj) {
  //         let modifiedObject = JSON.parse(JSON.stringify(obj)); // Kopiere das ursprüngliche Objekt

  //         modifiedObject.and.forEach((item, index) => {
  //           if (!item.value.includes("bra")) {
  //             if (item.value.includes("Top Recommended")) {
  //               item.value = ["Not Recommended"];
  //               modifiedObject.or.push(item); // Füge das modifizierte Objekt dem 'or'-Array hinzu
  //               delete modifiedObject.and[index]; // Lösche den Eintrag aus dem 'and'-Array
  //             } else {
  //               modifiedObject.not.push(item); // Füge das modifizierte Objekt dem 'not'-Array hinzu
  //               delete modifiedObject.and[index]; // Lösche den Eintrag aus dem 'and'-Array
  //             }
  //           }
  //         });

  //         modifiedObject.and = modifiedObject.and.filter(Boolean); // Entferne leere Einträge

  //         let modifiedObjectTwo = JSON.parse(JSON.stringify(modifiedObject));

  //         modifiedObjectTwo.or.forEach((item, index) => {
  //           if (!item.value.includes("Not Recommended")) {
  //             modifiedObjectTwo.and.push(item); // Füge das modifizierte Objekt dem 'and'-Array hinzu
  //             delete modifiedObjectTwo.or[index]; // Lösche den Eintrag aus dem 'or'-Array
  //           }
  //         });

  //         modifiedObjectTwo.or = modifiedObjectTwo.or.filter(Boolean); // Entferne leere Einträge

  //         return modifiedObjectTwo;
  //       }

  //       // Aufruf der Funktion
  //       let modifiedObjectNotRe = modifyObjectNot(productFilter);

  //       // Ausgabe des modifizierten Objekts
  //       // console.log(JSON.stringify(modifiedObjectNotRe, null, 2));
  //       const notRecommendedFilter = modifiedObjectNotRe;

  //       if (notRecommendedFilter.or.length > 0) {
  //         const notRecommended = await doRequest(
  //           "5. NOT RECOMMENDED",
  //           { ...body, offset: (notRecommendedPage - 1) * Config.pageSize },
  //           notRecommendedFilter,
  //           variantFilter
  //         );

  //         setNewResults(
  //           notRecommended,
  //           notRecommendedResults,
  //           setNotRecommendedResults
  //         );
  //       }
  //     }
  //   }

  //   fetchResults();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   visibleQuestions,
  //   notRecommendedPage,
  //   resultsPage,
  //   attributesResultsPage,
  //   showResults,
  // ]);

  /**
   * Scroll to current visible question
   */
  // useEffect(() => {
  //   scroller.scrollTo(
  //     visibleQuestions[visibleQuestions.length - 1],
  //     scrollOptions
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [visibleQuestions]);

  /**
   *
   */
  // useEffect(() => {
  //   if (showResults) {
  //     scroller.scrollTo("results", scrollOptions);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [showResults]);

  /**
   *
   */
  // useEffect(() => {
  //   if (visibleQuestions.includes("size2") && !hasSelectedSizes) {
  //     setShowTwoSizeSelectors(true);
  //   }
  // }, [visibleQuestions, hasSelectedSizes]);

  const isOneSelected = () => {
    const isselectedOptions = selectedOptions.some((item) =>
      item.options.some((option) => option.status === "active")
    );

    return (
      sizeConfigurations.some(
        (configuration) => configuration.baseSize !== ""
      ) || isselectedOptions
    );
  };

  const updateSelectedOption = (questionId, optionTitle) => {
    const clickedQuestion = selectedOptions.find(
      (question) => question.id === questionId
    );
    const clickedOption = clickedQuestion.options.find(
      (option) => option.title === optionTitle
    );
    const newClickedOptionStatus =
      clickedOption.status === "active" ? "initial" : "active";

    const newQuestionOptions = clickedQuestion.options.map((option) => {
      // handle clicked option
      if (option.title === optionTitle) {
        return { ...option, status: newClickedOptionStatus };
      }

      // if new state is active
      if (newClickedOptionStatus === "active") {
        // set all others to inactive if wildcard got clicked
        if (clickedOption.wildcard) return { ...option, status: "inactive" };
      }

      // set wildcard to inactive if other got clicked
      if (option.wildcard) return { ...option, status: "inactive" };

      // set all other to active or initial
      return {
        ...option,
        status: option.status === "active" ? option.status : "initial",
      };
    });

    const oneActive = newQuestionOptions.some(
      (option) => option.status === "active"
    );

    const newState = selectedOptions.map((question) => {
      if (question.id === questionId) {
        if (!oneActive) {
          // reset all
          return {
            id: question.id,
            options: question.options.map((option) => {
              return { ...option, status: "initial" };
            }),
          };
        }
        // no cleanup
        return {
          id: question.id,
          options: newQuestionOptions,
        };
      }
      // other question
      return question;
    });

    // Hier sind einstellungen für die id "breastform" bis codezeile 581
    // Finde den Index des Objekts mit dem Titel
    const stateBF = newState[1].options;

    const athleticIndex = stateBF.findIndex(
      (item) => item.title === "sportlich"
    );

    const tearDropIndex = stateBF.findIndex(
      (item) => item.title === "tränenförmig"
    );

    const relaxedIndex = stateBF.findIndex(
      (item) => item.title === "entspannt"
    );

    // Zählt die aktiven Selects

    let countActive = 0;

    for (const item of stateBF) {
      if (item.status === "active") {
        countActive++;
      }
    }

    // wenn der Count mindestens 2 ist werden alle anderen inaktive gestzet
    if (countActive >= 2) {
      for (const item of stateBF) {
        if (item.status !== "active") {
          item.status = "inactive";
        }
      }
    }

    // wenn der Select 3 ist wird per zufall prinzip einer inaktive gestzet
    if (countActive === 3) {
      const activeIndices = [];

      for (let i = 0; i < stateBF.length; i++) {
        if (
          stateBF[i].status === "active" &&
          stateBF[i].title !== optionTitle
        ) {
          activeIndices.push(i);
        }
      }

      if (activeIndices.length > 0) {
        // Zufälligen Index auswählen
        const randomIndex =
          activeIndices[Math.floor(Math.random() * activeIndices.length)];

        // Status des ausgewählten Index auf "inactive" setzen
        stateBF[randomIndex].status = "inactive";
      }
    }

    if (optionTitle === "entspannt") {
      if (relaxedIndex !== -1) {
        if (newState[1].options[relaxedIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inaktive"
          newState[1].options.find(
            (item) => item.title === "sportlich"
          ).status = "inactive";
          newState[1].options.find(
            (item) => item.title === "tränenförmig"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "tränenförmig") {
      if (tearDropIndex !== -1) {
        if (newState[1].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[1].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "sportlich") {
      if (athleticIndex !== -1) {
        if (newState[1].options[athleticIndex].status === "active") {
          // Wenn "sportlich" aktiv ist, setze "entspannt" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
      if (tearDropIndex !== -1) {
        if (newState[1].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "asymmetrisch") {
      if (tearDropIndex !== -1) {
        if (newState[1].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[1].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "Ost-West") {
      if (tearDropIndex !== -1) {
        if (newState[1].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[1].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[1].options.find(
            (item) => item.title === "entspannt"
          ).status = "inactive";
        }
      }
    }

    // Hier sind einstellungen für die id "breasttissuetype" bis codezeile ###
    // Finde den Index des Objekts mit dem Titel
    const stateBTT = newState[2].options;

    const softIndex = stateBTT.findIndex((item) => item.title === "Weich");

    const firmIndex = stateBTT.findIndex((item) => item.title === "Fest");

    if (optionTitle === "Weich") {
      if (softIndex !== -1) {
        if (newState[2].options[softIndex].status === "active") {
          // Wenn "Weich" aktiv ist, setze "Fest" auf "inactive"
          newState[2].options.find((item) => item.title === "Fest").status =
            "inactive";
        }
      }
    }

    if (optionTitle === "Mittel") {
      if (softIndex !== -1) {
        if (newState[2].options[softIndex].status === "active") {
          // Wenn "Weich" aktiv ist, setze "Fest" auf "inactive"
          newState[2].options.find((item) => item.title === "Fest").status =
            "inactive";
        }
      }
      if (firmIndex !== -1) {
        if (newState[2].options[firmIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find((item) => item.title === "Weich").status =
            "inactive";
        }
      }
    }

    if (optionTitle === "Fest") {
      if (firmIndex !== -1) {
        if (newState[2].options[firmIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find((item) => item.title === "Weich").status =
            "inactive";
        }
      }
    }

    setSelectedOptions(newState);

    // reset pagination on option change
    setResultsPage(1);
  };

  /**
   * This is triggered after clicking the next button in the ActionInfoBar
   * @param nextQuestion
   */
  const updateVisibleQuestions = (nextQuestion) => {
    if(step1 === undefined && nextQuestion !== "size") {
      getArticels();
    }

    if (!nextQuestion) {
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
      setCurrentQuestion("final");
      setShowResults(true);
      // if showResults is already true we can directly scroll to the results
      if (showResults) {
        scroller.scrollTo("results", scrollOptions);
      }
    } else {
      visibleQuestions.includes(nextQuestion)
        ? setVisibleQuestions(visibleQuestions.filter((item) => !nextQuestion))
        : setVisibleQuestions([...visibleQuestions, nextQuestion]);

      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
      setCurrentQuestion(nextQuestion);
    }
  };

  /**
   * When we switch to another question that is not the final step we have to ensure that the options of all following questions are set to the status "initial"
   * This is triggered when a user clicks on the "Auswahl ändern" button
   */
  const changeConfiguration = (questionId) => {
    if ("final" !== questionId) {
      const questionConfig = Config.questions.find(
        (question) => question.id === questionId
      );

      if (questionConfig) {
        const newVisible = visibleQuestions.filter(
          (question) => !questionConfig.following.includes(question)
        );

        const newOptionsSelected = selectedOptions.map((item) => {
          if (!newVisible.includes(item.id) || questionId === item.id) {
            return {
              id: item.id,
              options: item.options.map((option) => {
                return { ...option, status: "initial" };
              }),
            };
          }

          return item;
        });

        setCurrentQuestion(questionId);
        setAnsweredQuestions(questionConfig.before);
        setSelectedOptions(newOptionsSelected);
        setVisibleQuestions(newVisible);
        setShowResults(false);
      }
    }
  };

  // const resetFinder = () => {
  //   changeConfiguration("size");
  // };

  // if (
  //   attributeResults.items &&
  //   results.items &&
  //   !filterAttributeResults.items
  // ) {
  //   function removeDuplicates(originalObj1, obj2) {
  //     // Kopie von obj2 erstellen, um das Original nicht zu ändern
  //     const obj2Copy = { ...obj2 };

  //     // Überprüfen, ob items in obj1 und obj2 vorhanden sind
  //     if (originalObj1.items && obj2Copy.items) {
  //       const idsInObj1 = new Set(originalObj1.items.map((item) => item.id));

  //       // Filtere die Elemente in obj2Copy, die bereits in obj1 enthalten sind
  //       obj2Copy.items = obj2Copy.items.filter(
  //         (item) => !idsInObj1.has(item.id)
  //       );
  //     }

  //     return obj2Copy;
  //   }

  //   // Funktion aufrufen und das Ergebnis in einem neuen Objekt speichern
  //   const newObj1 = removeDuplicates(results, attributeResults);

  //   // Das Ergebnis ist in newObj1, und obj1 bleibt unverändert
  //   setFilterAttributeResults(newObj1);
  // }

  return (
    <div className="sus--bh-finder">
      <StartInfo
        visibleQuestions={visibleQuestions}
        updateVisibleQuestions={updateVisibleQuestions}
        QuestionToShow="size"
        imageMobile={imageMobile}
        imageDesktop={imageDesktop}
      />
      {Config.questions.map((question, index, array) => {
        if (
          (!question.display ||
            (question?.display(hasSelectedSizes) && !showResults) ||
            showTwoSizeSelectors) &&
          visibleQuestions.includes(question.id)
        ) {
          return (
            <Question
              key={question.id}
              id={question.id}
              question={question}
              results={results}
              selectedOptions={
                selectedOptions.find((item) => item.id === question.id).options
              }
              toggleOption={(key, wildcard) =>
                updateSelectedOption(question.id, key, wildcard)
              }
              step={index + 1}
              totalSteps={array.length - 1}
              isVisible={visibleQuestions.includes(question.id)}
              isAnswered={answeredQuestions.includes(question.id)}
              sizes={sizes}
              isSusSizeType={isSusSizeType}
              setIsSusSizeType={(type) => setIsSusSizeType(type)}
              activeSizeConfig={activeSizeConfig}
              setActiveSizeConfig={setActiveSizeConfig}
              sizeConfigurations={sizeConfigurations}
              setSizeConfigurations={setSizeConfigurations}
              lastSelectedSecondSize={lastSelectedSecondSize}
              setLastSelectedSecondSize={setLastSelectedSecondSize}
              visibleQuestions={visibleQuestions}
              changeConfiguration={changeConfiguration}
            />
          );
        }
        return null;
      })}
  
      <QuestionReview
        selectedOptions={selectedOptions}
        isOneSelected={isOneSelected()}
        visibleQuestions={visibleQuestions}
        updateSelectedOption={updateSelectedOption}
        isSusSizeType={isSusSizeType}
        setLastSelectedSecondSize={setLastSelectedSecondSize}
        sizeConfigurations={sizeConfigurations}
        setSizeConfigurations={setSizeConfigurations}
        hasSelectedSizes={hasSelectedSizes}
        setActiveSizeConfig={setActiveSizeConfig}
      />
      <ActionInfoBar
        total={results?.total || 0}
        visibleQuestions={visibleQuestions}
        updateVisibleQuestions={updateVisibleQuestions}
        hasSelectedSize={hasSelectedSizes}
        activeSizeConfig={activeSizeConfig}
        setActiveSizeConfig={setActiveSizeConfig}
        sizeConfigurations={sizeConfigurations}
        setSizeConfigurations={setSizeConfigurations}
      />

      {/*
      {showResults && <RestartBar resetFinder={resetFinder} />}
      <ProductResults
        name="results"
        results={results}
        show={showResults}
        currentPage={resultsPage}
        setPage={(page) => setResultsPage(page)}
        selectedOptions={selectedOptions}
        sizeConfigurations={sizeConfigurations}
        currencySign={currencySign}
      />
      {showResults && filterAttributeResults?.total > 0 && (
        <AdditionalProductResults
          name="attributeResults"
          title={Config.results.attributeResults.title}
          text={Config.results.attributeResults.text}
          products={filterAttributeResults?.items}
          total={filterAttributeResults?.total}
          currentPage={attributesResultsPage}
          setPage={(page) => setAttributesResultsPage(page)}
          selectedOptions={selectedOptions}
          optionId={"attributes"}
          currencySign={currencySign}
        />
      )}
      {(showResults && notRecommendedResults?.total) > 0 && (
        <AdditionalProductResults
          name="notRecommendedResults"
          title={Config.results.notRecommendedResults.title}
          text={Config.results.notRecommendedResults.text}
          products={notRecommendedResults?.items}
          total={notRecommendedResults?.total}
          currentPage={notRecommendedPage}
          setPage={(page) => setNotRecommendedPage(page)}
          currencySign={currencySign}
        />
      )}
      {showResults && <RestartBar resetFinder={resetFinder} />} */}
    </div>
  );
}

export default BHFinder;
