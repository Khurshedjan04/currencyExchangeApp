import { useEffect, useState } from "react";
import img from "./assets/exchange.png";
import Loading from "./Loading";

const URL = "https://api.exchangerate-api.com/v4/latest/USD";

const App = () => {
  const [currenciesNames, setCurrenciesNames] = useState([]);
  const [filteredCurrenciesNames, setFilteredCurrenciesNames] = useState([]);
  const [fromCurrency, setFromCurrency] = useState(
    localStorage.getItem("fromCurrency") || "USD"
  );
  const [toCurrency, setToCurrency] = useState(
    localStorage.getItem("toCurrency") || "EUR"
  );
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [rates, setRates] = useState({});
  const [extendedToInput, setExtendedToInput] = useState(false);
  const [extendedFromInput, setExtendedFromInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setRates(data.rates);
        setCurrenciesNames(Object.keys(data.rates));
        setFilteredCurrenciesNames(Object.keys(data.rates));
      } catch (error) {
        console.error("Error fetching currency data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!rates[fromCurrency] || !rates[toCurrency]) return;

    const converted = (amount / rates[fromCurrency]) * rates[toCurrency];

    setConvertedAmount(
      converted === 0
        ? converted.toFixed(2)
        : converted < 0.01
        ? converted.toFixed(6)
        : converted < 0.1
        ? converted.toFixed(4)
        : converted.toFixed(2)
    );
    localStorage.setItem("fromCurrency", fromCurrency);
    localStorage.setItem("toCurrency", toCurrency);
  }, [amount, fromCurrency, toCurrency, rates]);

  const filterCurrencies = (e) => {
    setFilteredCurrenciesNames(
      currenciesNames.filter((currency) =>
        currency.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleFromInputOnBlur = (e) => {
    setTimeout(() => {
      setExtendedFromInput(false);
      setFilteredCurrenciesNames(currenciesNames);
    }, 100);

    e.target.value ? e.target.value : setFromCurrency("USD");
    amount ? amount : setAmount(1);
    localStorage.setItem("fromCurrency", fromCurrency);

    for (let i = 0; i < currenciesNames.length; i++) {
      if (currenciesNames[i] === fromCurrency) return;
    }
    setFromCurrency(
      filteredCurrenciesNames.length > 0 ? filteredCurrenciesNames[0] : "USD"
    );
    localStorage.setItem("fromCurrency", fromCurrency);
  };

  const handleToInputOnBlur = (e) => {
    setTimeout(() => {
      setExtendedToInput(false);
      setFilteredCurrenciesNames(currenciesNames);
    }, 100);

    e.target.value ? e.target.value : setToCurrency("EUR");
    amount ? amount : setAmount(1);
    localStorage.setItem("toCurrency", toCurrency);

    for (let i = 0; i < currenciesNames.length; i++) {
      if (currenciesNames[i] === toCurrency) return;
    }
    setToCurrency(
      filteredCurrenciesNames.length > 0 ? filteredCurrenciesNames[0] : "EUR"
    );
    localStorage.setItem("toCurrency", toCurrency);
  };
  return (
    <div className="w-full h-screen bg-blue-700 relative overflow-hidden [font-family:Roboto]">
      <div className="max-w-6xl h-full mx-auto flex flex-col items-center justify-center gap-8 p-4 relative z-20">
        <h1 className="sm:text-5xl text-4xl font-semibold md:absolute top-42 text-white text-center">
          Valyuta konvertori
        </h1>
        <div className="mx-auto flex flex-col h-fit md:h-[15rem] lg:w-[50rem] md:w-[45rem] max-w-[25rem] md:max-w-full p-10 rounded-2xl shadow-2xl bg-white justify-between gap-4">
          <div className=" w-full flex flex-col md:flex-row items-center lg:gap-8 gap-6">
            <div className="bg-white md:flex-1 w-full border border-gray-400 rounded-xl overflow-hidden relative">
              <span
                className={
                  amount
                    ? "absolute top-1 text-sm text-gray-600 px-3"
                    : "hidden"
                }
              >
                Qiymat:
              </span>
              <input
                type="number"
                value={amount}
                onFocus={(e) => setAmount("")}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Qiymatini kiriting"
                className="w-full py-[1.6rem] px-4 outline-none text-lg"
              />
            </div>
            <div
              className="bg-white md:flex-1 w-full border border-gray-400 rounded-xl relative"
              onFocus={() => {
                setExtendedFromInput(true);
                setFromCurrency("");
              }}
              onBlur={(e) => handleFromInputOnBlur(e)}
              style={{ overflow: extendedFromInput ? "visible" : "hidden" }}
            >
              <span
                className={
                  fromCurrency
                    ? "absolute top-1 text-sm text-gray-600 px-3"
                    : "hidden"
                }
              >
                Dan:
              </span>
              <input
                type="text"
                placeholder="Valyutani tanlang"
                className={` w-full py-7 ${
                  extendedFromInput ? "p-4" : "p-12"
                } outline-none `}
                value={fromCurrency}
                onChange={(e) => {
                  setFromCurrency(e.target.value.toUpperCase());
                  filterCurrencies(e);
                }}
              />
              <img
                className={
                  extendedFromInput
                    ? "hidden"
                    : "h-6 absolute top-1/2 left-2 transform -translate-y-1/2"
                }
                src={`https://wise.com/public-resources/assets/flags/rectangle/${fromCurrency.toLowerCase()}.png`}
                alt=""
              />
              <div className="absolute w-full h-48 md:h-[16rem] mt-2 px-2 overflow-scroll flex flex-col gap-2 bg-white z-20">
                {filteredCurrenciesNames.map((currency) => (
                  <span
                    key={currency}
                    onClick={() => setFromCurrency(currency)}
                    className="px-1 border-b border-gray-300 cursor-pointer flex gap-4 items-center"
                  >
                    <img
                      className="h-6"
                      src={`https://wise.com/public-resources/assets/flags/rectangle/${currency.toLowerCase()}.png`}
                      alt=""
                    />

                    <span>{currency}</span>
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                setToCurrency(fromCurrency);
                setFromCurrency(toCurrency);
              }}
              className="md:h-8 h-6 w-auto -m-4 rotate-90 md:rotate-0 cursor-pointer"
            >
              <img className="w-full h-full" src={img} alt="" />
            </button>
            <div
              className="bg-white md:flex-1 w-full border border-gray-400 rounded-xl relative"
              onFocus={() => {
                setExtendedToInput(true);
                setToCurrency("");
              }}
              onBlur={(e) => handleToInputOnBlur(e)}
              style={{ overflow: extendedToInput ? "visible" : "hidden" }}
            >
              <span
                className={
                  toCurrency
                    ? "absolute top-1 text-sm text-gray-600 px-3"
                    : "hidden"
                }
              >
                Ga:
              </span>
              <input
                type="text"
                placeholder="Valyutani tanlang"
                className={` w-full py-6 ${
                  extendedToInput ? "p-4" : "p-12"
                } outline-none `}
                value={toCurrency}
                onChange={(e) => {
                  setToCurrency(e.target.value.toUpperCase());
                  filterCurrencies(e);
                }}
              />
              <img
                className={
                  extendedToInput
                    ? "hidden"
                    : "h-6 absolute top-1/2 left-2 transform -translate-y-1/2"
                }
                src={`https://wise.com/public-resources/assets/flags/rectangle/${toCurrency.toLowerCase()}.png`}
                alt=""
              />
              <div className="absolute w-full h-48 md:h-[16rem] mt-2 px-2 overflow-scroll flex flex-col gap-2 bg-white">
                {filteredCurrenciesNames.map((currency) => (
                  <span
                    key={currency}
                    onClick={() => setToCurrency(currency)}
                    className="px-1 border-b border-gray-300 cursor-pointer flex gap-4 items-center"
                  >
                    <img
                      className="h-6"
                      src={`https://wise.com/public-resources/assets/flags/rectangle/${currency.toLowerCase()}.png`}
                      alt=""
                    />

                    <span>{currency}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
          {!isNaN(convertedAmount) &&
          convertedAmount &&
          toCurrency &&
          fromCurrency ? (
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-600">
                {amount ? amount : 0} {fromCurrency} =
              </span>
              <h1 className="md:text-3xl text-2xl">
                {convertedAmount} {toCurrency}
              </h1>
            </div>
          ) : (
            <Loading />
          )}
        </div>
      </div>
      <div className="absolute bottom-0 z-auto h-[350px] w-full overflow-hidden before:absolute before:bottom-[-100px] before:left-[-200px] before:right-[-200px] before:top-0 before:rounded-[100%] before:bg-white"></div>
    </div>
  );
};

export default App;
