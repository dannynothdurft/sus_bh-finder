import React, { useState, useEffect } from "react";
import { scroller } from "react-scroll";
import Config from "../lang/configDE";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { incrementStep1, incrementStep2, incrementStep3, incrementStep4} from "../redux/reducers/steps";
import { incrementSize } from "../redux/reducers/size";

// Components
import StartInfo from "./StartInfo";
import Question from "./Question";
import QuestionReview from "./QuestionReview";
import ProductResults from "./ProductResults";
import ActionInfoBar from "./ActionInfoBar";
import RestartBar from "./RestartBar";

function BHFinder() {
  const imageMobile = "https://cdn.shopify.com/s/files/1/0855/3601/4616/files/bhf-motsi-small.jpg?v=1720433450";
  const imageDesktop = "https://cdn.shopify.com/s/files/1/0855/3601/4616/files/bhf-motsi-large.jpg?v=1720433451";

  const getInitIalOptions = () =>
    Config.questions.map((question) => {
      return {
        id: question.id,
        options: question.options.map((option) => {
          return {
            title: option.title,
            status: "initial",
            wildcard: option.wildcard,
            filters: option.attributes,
            excludes: option.excludes
          };
        }),
      };
    });

  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState(getInitIalOptions());
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(0);
  const { step1, step2, step3 } = useSelector((state) => state.steps);
  const { sizes } = useSelector((state) => state.sizes);
  const { filterSize } = useSelector((state) => state.filter);
  const hasSelectedSizes = filterSize ? true : false;

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
                products(first: 250, query: "product_type:bra*") {
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
            query searchProducts($productFilters: [ProductFilter!]!, $identifiers: [HasMetafieldsIdentifier!]!) {
              search(
                query: "",
                first: 250,
                types: PRODUCT,
                productFilters: $productFilters
              ) {
                edges {
                  node {
                    ... on Product {
                      title
                      handle
                      id
                      priceRange{
                          minVariantPrice{
                              amount
                              currencyCode
                          }
                      }
                      images(first:2){
                          nodes{
                              url
                          }
                      }
                      metafields(identifiers: $identifiers){
                          namespace
                          key
                          value
                      }
                    }
                  }
                }
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
              "identifiers" :[
                {
                  "namespace": "allgemein",
                  "key": "kollektion"
                },
                {
                  "namespace": "allgemein",
                  "key": "spitze"
                },
                {
                  "namespace": "produkt",
                  "key": "sugarshapetype"
                },
                {
                    "namespace": "bhs",
                    "key": "schnitt"
                },
                {
                  "namespace": "bhs",
                  "key": "eigenschaften"
                },
                {
                  "namespace": "bhs",
                  "key": "wattierung"
                },
                {
                  "namespace": "farbe",
                  "key": "text"
                },
                {
                  "namespace": "finder",
                  "key": "style"
                },
                {
                  "namespace": "finder",
                  "key": "asymmetrisch"
                },
                {
                  "namespace": "finder",
                  "key": "athletisch"
                },
                {
                  "namespace": "finder",
                  "key": "entspannt"
                },
                {
                  "namespace": "finder",
                  "key": "fest"
                },
                {
                  "namespace": "finder",
                  "key": "mittelfest"
                },
                {
                  "namespace": "finder",
                  "key": "seitlich"
                },
                {
                  "namespace": "finder",
                  "key": "traenenfoermig"
                },
                {
                  "namespace": "finder",
                  "key": "weich"
                }
             ]
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      dispatch(incrementStep1(result.data.search.edges));
      setCount(result.data.search.totalCount);

      scroller.scrollTo('attributes', {
        duration: 400,
        delay: 0,
        smooth: 'easeInOutQuart'
      });

    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const filterArticle = (step, nextQuestion) => {

    if(step === 2) {

      let empty;

      const hasActiveStatus = selectedOptions[step - 1].options
      .map(opt => opt.status)
      .some(status => status === 'active');

    if(hasActiveStatus) {
      const filteredOne = step1.flatMap((art) => {
        return art.node.metafields.flatMap((meta) => {
          if (meta !== null) {
            
            return selectedOptions[step - 1].options.flatMap((opt) => {
              if (opt.status === "active") {
                if(opt.title === "Ich bin für alles offen") {
                  if(empty === undefined) {
                    return empty = step1
                  }
                } else {
                  return opt.filters.flatMap((filterName) => {
                  if (filterName.name === meta.key && filterName.value === meta.value) {
                    if (opt.excludes.length > 0) {
                      const exclusionResult = opt.excludes.some((exc) => exc.name === meta.key && exc.value === meta.value);
                      if (exclusionResult) {
                        return [];
                      }
                      return [art];
                    }
                    return [art];
                  }
                  return [];
                });
                }
                
              }
              return [];
            });
          }
          return [];
        });
      });

      const uniqueProducts = filteredOne.filter((product, index, self) => 
        index === self.findIndex((t) => (
          t.node.title === product.node.title
        ))
      );

      if(empty) {
        dispatch(incrementStep2(empty))
      setStep(3);
      setCount(empty.length)
      } else {
        dispatch(incrementStep2(uniqueProducts))
      setStep(3);
      setCount(uniqueProducts.length)
      }
      
      

      if(nextQuestion === false) {
        setResults(uniqueProducts)
      }

      setTimeout(() => {
        scroller.scrollTo('breastform', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);

    } else {
      dispatch(incrementStep2(step1))
      setStep(3);
      setCount(step1.length)


      if(nextQuestion === false) {
        setResults(step1)
      }

      setTimeout(() => {
        scroller.scrollTo('breastform', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);
    }
    }

    if(step === 3) {

      let empty;

      const hasActiveStatus = selectedOptions[step - 1].options
      .map(opt => opt.status)
      .some(status => status === 'active');

    if(hasActiveStatus) {

      const filteredSecond = step2.flatMap((art) => {
        return art.node.metafields.flatMap((meta) => {
          if (meta !== null) {
            return selectedOptions[step - 1].options.flatMap((opt) => {
              if (opt.status === "active") {
                if(opt.title === "Ich weiß es nicht.") {
                  if(empty === undefined) {
                    return empty = step2
                  }
                } else {
                return opt.filters.flatMap((filterName) => {
                  if (filterName.name === meta.key && filterName.value === meta.value) {
                    if (opt.excludes.length > 0) {
                      const exclusionResult = opt.excludes.some((exc) => exc.name === meta.key && exc.value === meta.value);
                      if (exclusionResult) {
                        return [];
                      }
                      return [art];
                    }
                    return [art];
                  }
                  
                  return [];
                });}
              }
              return [];
            });
          }
          return [];
        });
      });
      
      const uniqueProducts = filteredSecond.filter((product, index, self) =>
        index === self.findIndex((t) => (
          t.node.title === product.node.title
        ))
      );
      
      if(empty) {
        dispatch(incrementStep3(empty))
      setStep(4);
      setCount(empty.length)
      } else {
dispatch(incrementStep3(uniqueProducts))
      setStep(4);
      setCount(uniqueProducts.length)
      }

      

      if(nextQuestion === false) {
        setResults(uniqueProducts)
      }

      setTimeout(() => {
        scroller.scrollTo('breasttissuetype', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);

    } else {
      dispatch(incrementStep3(step2))
      setStep(4);
      setCount(step2.length)

      if(nextQuestion === false) {
        setResults(step2)
      }
      setTimeout(() => {
        scroller.scrollTo('breasttissuetype', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);
    }
    }

    if(step === 4) {

      let empty;

      const hasActiveStatus = selectedOptions[step - 1].options
      .map(opt => opt.status)
      .some(status => status === 'active');

    if(hasActiveStatus) {

      const filteredThird = step3.flatMap((art) => {
        return art.node.metafields.flatMap((meta) => {
          if (meta !== null) {
            return selectedOptions[step - 1].options.flatMap((opt) => {

              if (opt.status === "active") {
                if(opt.title === "Ich weiß es nicht.") {
                  if(empty === undefined) {
                    return empty = step3
                  }
                } else {
                return opt.filters.flatMap((filterName) => {
                  if (filterName.name === meta.key && filterName.value === meta.value) {
                    if (opt.excludes.length > 0) {
                      const exclusionResult = opt.excludes.some((exc) => exc.name === meta.key && exc.value === meta.value);
                      if (exclusionResult) {
                        return [];
                      }
                      return [art];
                    }
                    return [art];
                  }
                  return [];
                });
              }
              }
              return [];
            });
          }
          return [];
        });
      });
      
      const uniqueProducts = filteredThird.filter((product, index, self) =>
        index === self.findIndex((t) => (
          t.node.title === product.node.title
        ))
      );
      

      if(empty) {
        dispatch(incrementStep4(empty))
      setStep(4);
      setCount(empty.length)
      } else {
        dispatch(incrementStep4(uniqueProducts))
        setStep(4);
        setCount(uniqueProducts.length)
      }

      

      if(nextQuestion === false) {
        setResults(uniqueProducts)
      }

      setTimeout(() => {
        scroller.scrollTo('results', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);
    } else {
      dispatch(incrementStep4(step3))
      setStep(4);
      setCount(step3.length)

      if(nextQuestion === false) {
        setResults(step3)
      }

      setTimeout(() => {
        scroller.scrollTo('results', {
          duration: 400,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      }, 1);
    }
    }
  }

  const resetFinder = () => {
    window.location.reload();
  };

  // Todo: Das muss alles bearbeitet werden!!  
  const [visibleQuestions, setVisibleQuestions] = useState(
    Config.questions.filter((item) => item.show).map((item) => item.id)
  );
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  const [showResults, setShowResults] = useState(false);

  // results
  const [results, setResults] = useState({});

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
    const stateBF = newState[2].options;
    
    const athleticIndex = stateBF.findIndex(
      (item) => item.title === "Sportlich"
    );

    const tearDropIndex = stateBF.findIndex(
      (item) => item.title === "Tränenförmig"
    );

    const relaxedIndex = stateBF.findIndex(
      (item) => item.title === "Entspannt"
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

    if (optionTitle === "Entspannt") {
      if (relaxedIndex !== -1) {
        if (newState[2].options[relaxedIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inaktive"
          newState[2].options.find(
            (item) => item.title === "Sportlich"
          ).status = "inactive";
          newState[2].options.find(
            (item) => item.title === "Tränenförmig"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "Tränenförmig") {
      if (tearDropIndex !== -1) {
        if (newState[2].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[2].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "Sportlich") {
      if (athleticIndex !== -1) {
        if (newState[2].options[athleticIndex].status === "active") {
          // Wenn "sportlich" aktiv ist, setze "entspannt" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
      if (tearDropIndex !== -1) {
        if (newState[2].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "Asymmetrisch") {
      if (tearDropIndex !== -1) {
        if (newState[2].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[2].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
    }

    if (optionTitle === "Ost-West") {
      if (tearDropIndex !== -1) {
        if (newState[2].options[tearDropIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
      if (athleticIndex !== -1) {
        if (newState[2].options[athleticIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[2].options.find(
            (item) => item.title === "Entspannt"
          ).status = "inactive";
        }
      }
    }

    // Hier sind einstellungen für die id "breasttissuetype" bis codezeile ###
    // Finde den Index des Objekts mit dem Titel
    const stateBTT = newState[3].options;

    const softIndex = stateBTT.findIndex((item) => item.title === "Weich");

    const firmIndex = stateBTT.findIndex((item) => item.title === "Fest");


    if (optionTitle === "Weich") {
      if (softIndex !== -1) {
        if (newState[3].options[softIndex].status === "active") {
          // Wenn "Weich" aktiv ist, setze "Fest" auf "inactive"
          newState[3].options.find((item) => item.title === "Fest").status =
            "inactive";
        }
      }
    }

    if (optionTitle === "Mittel") {
      if (softIndex !== -1) {
        if (newState[3].options[softIndex].status === "active") {
          // Wenn "Weich" aktiv ist, setze "Fest" auf "inactive"
          newState[3].options.find((item) => item.title === "Fest").status =
            "inactive";
        }
      }
      if (firmIndex !== -1) {
        if (newState[3].options[firmIndex].status === "active") {
          // Wenn "Fest" aktiv ist, setze "weich" auf "inactive"
          newState[3].options.find((item) => item.title === "Weich").status =
            "inactive";
        }
      }
    }

    if (optionTitle === "Fest") {
      if (firmIndex !== -1) {
        if (newState[3].options[firmIndex].status === "active") {
          // Wenn "entspannt" aktiv ist, setze "sportlich" auf "inactive"
          newState[3].options.find((item) => item.title === "Weich").status =
            "inactive";
        }
      }
    }

    setSelectedOptions(newState);
  };

  /**
   * This is triggered after clicking the next button in the ActionInfoBar
   * @param nextQuestion
   */
  const updateVisibleQuestions = (nextQuestion) => {
    if(nextQuestion === "attributes") {
      getArticels();
      setStep(step + 1)
    } else {
      filterArticle(step, nextQuestion)
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

    selectedOptions.map((id, index) => {
      if(id.id === questionId) {
        return setStep(index + 1)
      } else {
        return null
      }
    })

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

    setTimeout(() => {
      scroller.scrollTo(questionId, {
        duration: 400,
        delay: 0,
        smooth: 'easeInOutQuart'
      });
    }, 1);

  };

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
            question?.display(hasSelectedSizes)) && !showResults &&
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
        total={count}
        visibleQuestions={visibleQuestions}
        updateVisibleQuestions={updateVisibleQuestions}
        hasSelectedSize={hasSelectedSizes}
        activeSizeConfig={activeSizeConfig}
        setActiveSizeConfig={setActiveSizeConfig}
        sizeConfigurations={sizeConfigurations}
        setSizeConfigurations={setSizeConfigurations}
      />

     
      {showResults && <RestartBar resetFinder={resetFinder} />}
      <ProductResults
        name="results"
        results={results}
        show={showResults}
        selectedOptions={selectedOptions}
        sizeConfigurations={sizeConfigurations}
      />
      {showResults && <RestartBar resetFinder={resetFinder} />}
    </div>
  );
}

export default BHFinder;
