import axios from 'axios'

export const Axios = axios.create({
    baseURL: 'http://localhost:4000/graphql'
})

export const BambooAxios = axios.create({
    baseURL: 'https://44d4dec71a54a30986f0ea0a5ddf944ae84a58ec:x@api.bamboohr.com/api/gateway.php/changecx/v1'
})