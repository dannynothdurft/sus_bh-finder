import React from 'react'
import ProductList from './ProductList'
import { Element } from 'react-scroll'

function AdditionalProductResults({
  title = '',
  text = '',
  hint = '',
  total = 0,
  products = [],
  currentPage = 1,
  name = '',
  setPage,
  selectedOptions = [],
  optionId = '',
  currencySign,
}) {
  if (!products.length) return null

  function getActiveOptionsMarkup(activeOptions = []) {
    if (!activeOptions.length) return null

    const markup = activeOptions.map(
      option => `
        <span class="bh-finder__productListWrapper-option">${option.title}</span>
        `
    )

    return markup.join(' oder ').trim() + '.'
  }

  const titleClasses = 'bh-finder__welcomeText bh-finder__otherResultsTitle'

  const activeOptions = selectedOptions.length
    ? selectedOptions
        .find(item => item.id === optionId)
        ?.options?.filter(option => 'active' === option.status)
    : []
  const activeOptionsMarkup = getActiveOptionsMarkup(activeOptions)

  return (
    <>
      <div className="trenner">
        <span>
          <i className="fa fa-heart" />
        </span>
      </div>
      <div className="bh-finder__productListWrapper">
        <Element name={name} />
        {title && (
          <p
            className={titleClasses}
            dangerouslySetInnerHTML={{
              __html: title,
            }}
          />
        )}

        {text && (
          <p
            dangerouslySetInnerHTML={{
              __html: activeOptionsMarkup
                ? text.concat(activeOptionsMarkup)
                : text,
            }}
          />
        )}

        {hint && (
          <p
            className="bh-finder__hint"
            dangerouslySetInnerHTML={{
              __html: hint,
            }}
          />
        )}

        <ProductList
          products={products}
          total={total}
          currentPage={currentPage}
          paginate={page => {
            setPage(page)
          }}
          currencySign={currencySign}
        />
      </div>
    </>
  )
}

export default AdditionalProductResults
