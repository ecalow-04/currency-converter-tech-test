# React Currency Converter

This repository contains a Currency Converter I created in React for a technical test.

Packages/languages used include:

- React
- JavaScript
- TailwindCSS
- Vite
- Redux Toolkit
- Yup
- Vitest

## Requirements

- **Allow the user to select a base currency** - The base currency selection is built using the dropdown component that is
  accessed through the form wrapper. Whenever the base currency is changed, the app makes a new request to the floatrates API
  to get the conversion rates for the currency selected, it will then automatically convert the amount inputted again.

- **Allow the user to enter the amount to be converted** - The input amount is built using the input component. Whenever the
  amount is changed, as long as it is valid, it will instantly convert it.

- **Allow the user to select a currency to convert the amount to** - There is another dropdown component used to select the
  currency that the user wants to convert their amount to.

- **Display the converted amount to 2 decimal places** - An input component is used to display the converted amount. Also, to
  make it work a bit more like the google currency converter, you can also type in the converted amount input box and it will
  convert the base amount.

- **The application should have basic styling** - TailwindCSS has been used (best thing ever created).

- **Basic Responsiveness** - Since I have used Tailwind, it has handled all of the responsiveness for me already, tested with
  chrome dimensions tool for viewing on different screens.

- **Any values selected or entered should be stored using state management** - Redux Toolkit has been used to build the reducer
  and actions for any value selected or entered by the user.

- **Include reusable components within your app** - I've created a form wrapper that can be used to access the input and
  dropdown components.

## Design Choices

### Components

- **form/Dropdown** - This is made to be a general dropdown component for any kind of form created in the app. It consists
  of a select tag with the options mapped from params passed down to it.
  **form/Input** - This is also made to be a general input component for any kind of form created in the app. It consists of
  an input tag and a validate function that is called on change and validates according to any validation schema passed down
  to it.

- **Form** - I decided to create a wrapper for the form components, the reason for this was so that if in the future I decided
  to expand upon the app and have multiple forms along with multiple form components, I wouldn't have to import all the
  components and any of the logic included in it. Another reason this wrapper exists is because originally, I had create,
  update and update methods in it, where create would dispatch an action to a form reducer to create a new form instance with
  a fields property. I decided to scrap this idea when I got further into it and decided that I was over complicating it and
  that it was going to make continuing harder when it is supposed to be a simple currency converter app.

- **Spinner** - This is a simple reusable spinner component I copied from [here](https://flowbite.com/docs/components/spinner/).

### Features

- **CurrencyConverter/CurrencyConverter** - This is where all of the converter logic and UI is brought together to make it all
  functional. It has been made it this way so that it can easily be included in other pages on the app in the future. Since one of
  the additional requirements of this app was to demonstrate my knowledge of Redux and state management, there are only have 2
  useState hooks, which are for storing the currency codes and the loading state of the request for the currency codes. Since
  the currency codes are retrieved through an api request, while the request is in progress, a spinner component is displayed
  so the user knows it is loading. There are 2 inputs and 2 dropdowns used on this page, all for inputting a value to convert,
  displaying the converted value, selecting base currency and selecting the currency to convert to.

- **CurrencyConverter/currencyConverterSlice** - This contains the reducer and actions that power the currency converter feature.
  I have also included all of the logic for converting the currencies and getting the conversion rates in this file aswell because
  I felt it made sense to do so as it is where all of the state values are set, including conversion results.

- **CurrencyConverter/currencyConverter.test** - Unit tests for the currency converter slice.

### Utils

- **currencyCodes** - Contains a function for getting currency codes that get passed down to the dropdown components, these codes
  are retrieved from making a request to the floatrates API. Originally, this file did contain the logic the getting conversion
  rates by their code, but I decided to move that into the slice file so I could make use of thunk.

## Validation

I have used Yup for validation. Since it is not a big app, I only have 1 schema that I pass to my input components. The schema
includes checking for type, setting the field to be required, minimum value can only be 0 and a regex test for checking if the
value has more than 2 decimal places.

## Redux

Before creating this app, I used the old way of redux state management, but I read that Redux Toolkit is now the favoured way of
handling state, so I decided to pick it up and it was actually quite simple to implement when you have previous knowledge of using
redux as it essentially just reduces how much code you have to write yourself and in my opinion becomes easier to understand what is
going on.

## Testing

Run:
`npm run test`

As of writing this, I have never created tests in React, although I have created some in Ember.js and elixir before so
I understand the concept of testing. Unintentionally, I made my life harder by using Vite because that meant that the tried
and tested and go-to test suite of React (Jest) isn't really supported in Vite so I had to go with the alternative Vitest,
which could have been the reason I ran into a few issues when trying to make tests (see currencyConverterSlice.test.jsx).

## Running the app

Install packages: `npm install`

Start app: `npm run dev`
