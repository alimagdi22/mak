import { MostSearchedFlightsResponse } from "./interfaces";

export const cheapestFlights: MostSearchedFlightsResponse[] = [
    {
        "flightKey": "CAI_KWI_26-08-2025_Oneway",
        "searchCriteria": {
            "searchResultReturned": true,
            "searchId": "kyqpor",
            "source": "Wego",
            "device": null,
            "pos": "KW",
            "currency": "KWD",
            "language": "en",
            "flights": [
                {
                    "departingFrom": "CAI",
                    "arrivingTo": "KWI",
                    "departingOnDate": "2025-08-26T00:00:00",
                    "departingAirport": {
                        en: {
                            airportCode: 'CAI',
                            airportName: 'Cairo International Airport',
                            cityName: 'Cairo',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'Egypt',
                            regionName: 'Africa',
                        },
                        ar: {
                            airportCode: 'CAI',
                            airportName: 'مطار القاهرة الدولي',
                            cityName: 'القاهرة',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'مصر',
                            regionName: 'Africa',
                        }
                    },
                    "arrivingAirport": {
                        en: {
                            airportCode: 'KWI',
                            airportName: 'Kuwait International Airport',
                            cityName: 'Kuwait',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'Kuwait',
                            regionName: 'Asia',
                        },
                        ar: {
                            airportCode: 'KWI',
                            airportName: 'مطار الكويت الدولى ',
                            cityName: 'مدينة الكويت',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'الكويت',
                            regionName: 'Asia',
                        },
                    }
                }
            ],
            "flightType": "Oneway",
            "preferredAirline": null,
            "selectedFlightClass": "Economy",
            "adultNum": 1,
            "childNum": 0,
            "infantNum": 0,
            "totalPassengersNum": 1,
            "selectDirectFlightsOnly": false,
            "childAges": 7,
            "infantAges": 1
        },
        "cheapestAirItinerary": {
            "id": null,
            "referralLink": "https://wg.bookingwep.com/checkout?sid=kyqpor_2D7&sequenceNum=1&pkey=52&utm_source=&utm_medium=",
            "sequenceNum": 1,
            "pKey": "52",
            "pcc": "2D7",
            "isRefundable": false,
            "itinTotalFare": {
                "amount": 178.158,
                "fareAmount": 0,
                "promoCode": null,
                "promoDiscount": 0,
                "currencyCode": "KWD",
                "totalTaxes": 43.65,
                "dName": "CAI KWI GLOBAL",
                "dValue": null,
                "mName": null
            },
            "totalDuration": 930,
            "isBaseBrand": false,
            "deptDate": "2025-08-26T23:25:00",
            "arrivalDate": "2025-08-27T14:55:00",
            "cabinClass": "Economy",
            "flightType": "",
            "allJourney": {
                "flights": [
                    {
                        "flightDTO": [
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": true,
                                "deptTime": "23:25:00",
                                "landTime": "02:10:00",
                                "departureDate": "2025-08-26T23:25:00",
                                "arrivalDate": "2025-08-27T02:10:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": "Flynas",
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": "Flynas",
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 165,
                                "departureTerminalAirport": {
                                    "airportCode": "CAI",
                                    "airportName": "Cairo International Airport",
                                    "cityName": "Cairo",
                                    "cityCode": "CAI",
                                    "countryCode": "EG",
                                    "countryName": "Egypt",
                                    "regionName": "Africa",
                                    "terminal": "3",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "King Khaled International Airport",
                                    "cityName": "Riyadh",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "Saudi Arabia",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "transitTime": "11:25:00",
                                "flightInfo": {
                                    "flightNumber": "266",
                                    "equipmentNumber": "32N",
                                    "mealCode": "",
                                    "bookingCode": "B",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            },
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": false,
                                "deptTime": "13:35:00",
                                "landTime": "14:55:00",
                                "departureDate": "2025-08-27T13:35:00",
                                "arrivalDate": "2025-08-27T14:55:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": "Flynas",
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": "Flynas",
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 80,
                                "departureTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "King Khaled International Airport",
                                    "cityName": "Riyadh",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "Saudi Arabia",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "KWI",
                                    "airportName": "Kuwait International Airport",
                                    "cityName": "Kuwait",
                                    "cityCode": "KWI",
                                    "countryCode": "KW",
                                    "countryName": "Kuwait",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "transitTime": "00:00:00",
                                "flightInfo": {
                                    "flightNumber": "231",
                                    "equipmentNumber": "737",
                                    "mealCode": "",
                                    "bookingCode": "P",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            }
                        ],
                        "flightAirline": {
                            "airlineCode": "XY",
                            "airlineName": "Flynas",
                            "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                            "alternativeBusinessName": "Flynas",
                            "passportDetailsRequired": true
                        },
                        "elapsedTime": 930,
                        "stopsNum": 1
                    }
                ]
            },
            "baggageInformation": [
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": "Flynas",
                    "deptCity": "Cairo",
                    "landCity": "Riyadh",
                    "flightNum": "266"
                },
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": "Flynas",
                    "deptCity": "Riyadh",
                    "landCity": "Kuwait",
                    "flightNum": "231"
                }
            ],
            "passengerFareBreakDownDTOs": [
                {
                    "key": "RcXcOjpDuDKAlKVJ2NAAAA==",
                    "pricingMethod": "Guaranteed",
                    "cancelPenaltyDTOs": [
                        {
                            "price": 0,
                            "curency": "",
                            "percentage": 100,
                            "percentageApplied": false,
                            "applied": false,
                            "sector": null,
                            "time": null
                        }
                    ],
                    "changePenaltyDTOs": [
                        {
                            "price": 15,
                            "curency": "KWD",
                            "percentage": 0,
                            "percentageApplied": false,
                            "applied": false,
                            "sector": null,
                            "time": null
                        }
                    ],
                    "passengerQuantity": 1,
                    "passengerType": "ADT",
                    "passengersRef": [
                        "119U863G4378PI1CBNEALU=="
                    ],
                    "flightFaresDTOs": [
                        {
                            "fareAmount": 23661,
                            "fareType": "BaseFare",
                            "currencyCode": "EGP"
                        },
                        {
                            "fareAmount": 150,
                            "fareType": "EquivFare",
                            "currencyCode": "KWD"
                        },
                        {
                            "fareAmount": 193.65,
                            "fareType": "TotalFare",
                            "currencyCode": "KWD"
                        },
                        {
                            "fareAmount": 43.65,
                            "fareType": "TotalTax",
                            "currencyCode": "KWD"
                        }
                    ],
                    "taxes": [
                        {
                            "taxCode": "N4",
                            "amount": 2,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAmKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "EG",
                            "amount": 0.95,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAnKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "EQ",
                            "amount": 0.65,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAoKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "JK",
                            "amount": 0.65,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKApKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "O2",
                            "amount": 0.1,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAqKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "O9",
                            "amount": 0.35,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKArKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "QH",
                            "amount": 7.7,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAsKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "S4",
                            "amount": 0.65,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAtKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "XK",
                            "amount": 0.95,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAuKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "E3",
                            "amount": 1.4,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAvKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "IO",
                            "amount": 5.35,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAwKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "T2",
                            "amount": 0.45,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAxKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "YQ",
                            "amount": 15.55,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAyKVJ2NAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "YR",
                            "amount": 6.9,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "RcXcOjpDuDKAzKVJ2NAAAAAA",
                            "countryCode": null
                        }
                    ]
                }
            ]
        },
        "searchCount": 84,
        "discountPercentage": 0,
        "originalPrice": 178.158
    },
    {
        "flightKey": "KWI_CAI_03-09-2025|CAI_KWI_06-09-2025_Roundtrip",
        "searchCriteria": {
            "searchResultReturned": true,
            "searchId": "YBetGf",
            "source": "Wego",
            "device": null,
            "pos": "KW",
            "currency": "KWD",
            "language": "ar",
            "flights": [
                {
                    "departingFrom": "KWI",
                    "arrivingTo": "CAI",
                    "departingOnDate": "2025-09-03T00:00:00",
                    "departingAirport": {
                        en: {
                            airportCode: 'CAI',
                            airportName: 'Cairo International Airport',
                            cityName: 'Cairo',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'Egypt',
                            regionName: 'Africa',
                        },
                        ar: {
                            airportCode: 'CAI',
                            airportName: 'مطار القاهرة الدولي',
                            cityName: 'القاهرة',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'مصر',
                            regionName: 'Africa',
                        }
                    },
                    "arrivingAirport": {
                        en: {
                            airportCode: 'KWI',
                            airportName: 'Kuwait International Airport',
                            cityName: 'Kuwait',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'Kuwait',
                            regionName: 'Asia',
                        },
                        ar: {
                            airportCode: 'KWI',
                            airportName: 'مطار الكويت الدولى ',
                            cityName: 'مدينة الكويت',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'الكويت',
                            regionName: 'Asia',
                        },
                    }
                },
                {
                    "departingFrom": "CAI",
                    "arrivingTo": "KWI",
                    "departingOnDate": "2025-09-06T00:00:00",
                    "departingAirport": {
                        en: {
                            airportCode: 'CAI',
                            airportName: 'Cairo International Airport',
                            cityName: 'Cairo',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'Egypt',
                            regionName: 'Africa',
                        },
                        ar: {
                            airportCode: 'CAI',
                            airportName: 'مطار القاهرة الدولي',
                            cityName: 'القاهرة',
                            cityCode: 'CAI',
                            countryCode: 'EG',
                            countryName: 'مصر',
                            regionName: 'Africa',
                        }
                    },
                    "arrivingAirport": {
                        en: {
                            airportCode: 'KWI',
                            airportName: 'Kuwait International Airport',
                            cityName: 'Kuwait',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'Kuwait',
                            regionName: 'Asia',
                        },
                        ar: {
                            airportCode: 'KWI',
                            airportName: 'مطار الكويت الدولى ',
                            cityName: 'مدينة الكويت',
                            cityCode: 'KWI',
                            countryCode: 'KW',
                            countryName: 'الكويت',
                            regionName: 'Asia',
                        },
                    }
                }
            ],
            "flightType": "Roundtrip",
            "preferredAirline": null,
            "selectedFlightClass": "Economy",
            "adultNum": 1,
            "childNum": 0,
            "infantNum": 0,
            "totalPassengersNum": 1,
            "selectDirectFlightsOnly": false,
            "childAges": 7,
            "infantAges": 1
        },
        "cheapestAirItinerary": {
            "id": null,
            "referralLink": "https://wg.bookingwep.com/checkout?sid=YBetGf_2D7&sequenceNum=1&pkey=52&utm_source=&utm_medium=",
            "sequenceNum": 1,
            "pKey": "52",
            "pcc": "2D7",
            "isRefundable": false,
            "itinTotalFare": {
                "amount": 160.928,
                "fareAmount": 0,
                "promoCode": null,
                "promoDiscount": 0,
                "currencyCode": "KWD",
                "totalTaxes": 65.2,
                "dName": "arrival CAI",
                "dValue": null,
                "mName": null
            },
            "totalDuration": 1340,
            "isBaseBrand": false,
            "deptDate": "2025-09-03T15:45:00",
            "arrivalDate": "2025-09-03T22:35:00",
            "cabinClass": "Economy",
            "flightType": "",
            "allJourney": {
                "flights": [
                    {
                        "flightDTO": [
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": true,
                                "deptTime": "15:45:00",
                                "landTime": "17:05:00",
                                "departureDate": "2025-09-03T15:45:00",
                                "arrivalDate": "2025-09-03T17:05:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": null,
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 80,
                                "departureTerminalAirport": {
                                    "airportCode": "KWI",
                                    "airportName": "مطار الكويت الدولى ",
                                    "cityName": "مدينة الكويت",
                                    "cityCode": "KWI",
                                    "countryCode": "KW",
                                    "countryName": "کویت",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "مطار الملك عبد العزيز الدولي",
                                    "cityName": "الرياض",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "عربستان سعودی",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "transitTime": "02:35:00",
                                "flightInfo": {
                                    "flightNumber": "232",
                                    "equipmentNumber": "737",
                                    "mealCode": "",
                                    "bookingCode": "H",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            },
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": false,
                                "deptTime": "19:40:00",
                                "landTime": "22:35:00",
                                "departureDate": "2025-09-03T19:40:00",
                                "arrivalDate": "2025-09-03T22:35:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": null,
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 175,
                                "departureTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "مطار الملك عبد العزيز الدولي",
                                    "cityName": "الرياض",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "عربستان سعودی",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "CAI",
                                    "airportName": "مطار القاهرة الدولي",
                                    "cityName": "القاهرة",
                                    "cityCode": "CAI",
                                    "countryCode": "EG",
                                    "countryName": "مصر",
                                    "regionName": "Africa",
                                    "terminal": "3",
                                    "cityImage": null
                                },
                                "transitTime": "00:00:00",
                                "flightInfo": {
                                    "flightNumber": "265",
                                    "equipmentNumber": "32N",
                                    "mealCode": "",
                                    "bookingCode": "H",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            }
                        ],
                        "flightAirline": {
                            "airlineCode": "XY",
                            "airlineName": null,
                            "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                            "alternativeBusinessName": null,
                            "passportDetailsRequired": true
                        },
                        "elapsedTime": 410,
                        "stopsNum": 1
                    },
                    {
                        "flightDTO": [
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": true,
                                "deptTime": "23:25:00",
                                "landTime": "02:10:00",
                                "departureDate": "2025-09-06T23:25:00",
                                "arrivalDate": "2025-09-07T02:10:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": null,
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 165,
                                "departureTerminalAirport": {
                                    "airportCode": "CAI",
                                    "airportName": "مطار القاهرة الدولي",
                                    "cityName": "القاهرة",
                                    "cityCode": "CAI",
                                    "countryCode": "EG",
                                    "countryName": "مصر",
                                    "regionName": "Africa",
                                    "terminal": "3",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "مطار الملك عبد العزيز الدولي",
                                    "cityName": "الرياض",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "عربستان سعودی",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "transitTime": "11:25:00",
                                "flightInfo": {
                                    "flightNumber": "266",
                                    "equipmentNumber": "32N",
                                    "mealCode": "",
                                    "bookingCode": "M",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            },
                            {
                                "departureOffset": 3,
                                "arrivalOffset": 3,
                                "isStopSegment": false,
                                "deptTime": "13:35:00",
                                "landTime": "14:55:00",
                                "departureDate": "2025-09-07T13:35:00",
                                "arrivalDate": "2025-09-07T14:55:00",
                                "flightAirline": {
                                    "airlineCode": "XY",
                                    "airlineName": null,
                                    "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": true
                                },
                                "operatedAirline": {
                                    "airlineCode": null,
                                    "airlineName": null,
                                    "airlineLogo": null,
                                    "alternativeBusinessName": null,
                                    "passportDetailsRequired": false
                                },
                                "durationPerLeg": 80,
                                "departureTerminalAirport": {
                                    "airportCode": "RUH",
                                    "airportName": "مطار الملك عبد العزيز الدولي",
                                    "cityName": "الرياض",
                                    "cityCode": "RUH",
                                    "countryCode": "SA",
                                    "countryName": "عربستان سعودی",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "arrivalTerminalAirport": {
                                    "airportCode": "KWI",
                                    "airportName": "مطار الكويت الدولى ",
                                    "cityName": "مدينة الكويت",
                                    "cityCode": "KWI",
                                    "countryCode": "KW",
                                    "countryName": "کویت",
                                    "regionName": "Asia",
                                    "terminal": "1",
                                    "cityImage": null
                                },
                                "transitTime": "00:00:00",
                                "flightInfo": {
                                    "flightNumber": "231",
                                    "equipmentNumber": "737",
                                    "mealCode": "",
                                    "bookingCode": "Q",
                                    "cabinClass": "Economy"
                                },
                                "segmentDetails": {
                                    "uniqueKey": "",
                                    "baggage": "20 Kilograms",
                                    "childBaggage": "20 Kilograms",
                                    "infantBaggage": "20 Kilograms"
                                },
                                "supplierRefID": null
                            }
                        ],
                        "flightAirline": {
                            "airlineCode": "XY",
                            "airlineName": null,
                            "airlineLogo": "https://images.triphands.com/Content\\AirlineIcons\\XY.png",
                            "alternativeBusinessName": null,
                            "passportDetailsRequired": true
                        },
                        "elapsedTime": 930,
                        "stopsNum": 1
                    }
                ]
            },
            "baggageInformation": [
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": null,
                    "deptCity": "مدينة الكويت",
                    "landCity": "الرياض",
                    "flightNum": "232"
                },
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": null,
                    "deptCity": "الرياض",
                    "landCity": "القاهرة",
                    "flightNum": "265"
                },
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": null,
                    "deptCity": "القاهرة",
                    "landCity": "الرياض",
                    "flightNum": "266"
                },
                {
                    "baggage": "20 Kilograms",
                    "childBaggage": "20 Kilograms",
                    "infantBaggage": "20 Kilograms",
                    "airlineName": null,
                    "deptCity": "الرياض",
                    "landCity": "مدينة الكويت",
                    "flightNum": "231"
                }
            ],
            "passengerFareBreakDownDTOs": [
                {
                    "key": "JTncOj0DuDKA1LmYGOAAAA==",
                    "pricingMethod": "Guaranteed",
                    "cancelPenaltyDTOs": [
                        {
                            "price": 0,
                            "curency": "",
                            "percentage": 100,
                            "percentageApplied": false,
                            "applied": false,
                            "sector": null,
                            "time": null
                        }
                    ],
                    "changePenaltyDTOs": [
                        {
                            "price": 15,
                            "curency": "KWD",
                            "percentage": 0,
                            "percentageApplied": false,
                            "applied": false,
                            "sector": null,
                            "time": null
                        }
                    ],
                    "passengerQuantity": 1,
                    "passengerType": "ADT",
                    "passengersRef": [
                        "7M47Q9I0NXS015VPAIGX17=="
                    ],
                    "flightFaresDTOs": [
                        {
                            "fareAmount": 1290,
                            "fareType": "BaseFare",
                            "currencyCode": "SAR"
                        },
                        {
                            "fareAmount": 106,
                            "fareType": "EquivFare",
                            "currencyCode": "KWD"
                        },
                        {
                            "fareAmount": 171.2,
                            "fareType": "TotalFare",
                            "currencyCode": "KWD"
                        },
                        {
                            "fareAmount": 65.2,
                            "fareType": "TotalTax",
                            "currencyCode": "KWD"
                        }
                    ],
                    "taxes": [
                        {
                            "taxCode": "GZ",
                            "amount": 1,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA2LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "KW",
                            "amount": 2,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA3LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "N4",
                            "amount": 5,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA4LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "YX",
                            "amount": 0.25,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA5LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "E3",
                            "amount": 2.8,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA6LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "IO",
                            "amount": 10.7,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA7LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "T2",
                            "amount": 0.9,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA8LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "EQ",
                            "amount": 0.65,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA9LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "JK",
                            "amount": 0.65,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA-LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "O2",
                            "amount": 0.1,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKA/LmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "O9",
                            "amount": 0.35,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKAAMmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "QH",
                            "amount": 7.7,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKABMmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "S4",
                            "amount": 1.3,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKACMmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "YQ",
                            "amount": 18,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKADMmYGOAAAAAA",
                            "countryCode": null
                        },
                        {
                            "taxCode": "YR",
                            "amount": 13.8,
                            "taxName": null,
                            "taxCurrencyCode": "KWD",
                            "content": "JTncOj0DuDKAEMmYGOAAAAAA",
                            "countryCode": null
                        }
                    ]
                }
            ]
        },
        "searchCount": 25,
        "discountPercentage": 0,
        "originalPrice": 160.928
    }
]