// import 'dotenv/config';
import axios from "axios";

export const get_currency_exchange = {
    "type": "function",
    "function": {
        "name": "get_currency_exchange",
        "description": "Makes the currency conversion based on a given base currency and target currency",
        "parameters": {
            "type": "object",
            "properties": {
                "base_currency": {
                    "type": "string",
                    "description": "The ISO 4217 Three Letter Currency Codes. e.g. 'USD', 'EUR', 'MXN'",
                },
                "target_currency": {
                    "type": "string",
                    "description": "The ISO 4217 Three Letter Currency Codes. e.g, 'USD', 'EUR', 'MXN'",
                },
            },
            "required": ["base_currency", "target_currency"],
        },
    }
}

export const getCurrencyExchange = async (args) => {

    const apiKey = process.env.EXCHANGE_RATE_API_KEY;

    const { base_currency, target_currency } = args;

    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${base_currency}/${target_currency}`;

    try {
        const response = await axios.get(apiUrl);
        const {
            time_last_update_utc,
            base_code,
            target_code,
            conversion_rate,

        } = response.data;
        
        return {
            last_update: time_last_update_utc,
            base_currency: base_code,
            target_currency: target_code,
            exchange_rate: conversion_rate,
        }

    } catch (error) {
        console.log(error);
    }

}
