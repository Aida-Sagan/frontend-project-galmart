import axios from 'axios';

export const fetchSearchProducts = async ({ text, page = 1, sort = 'popularity' }) => {
    try {
        const response = await axios({
            method: 'get',
            url: '/api/v2/catalog/goods/',
            // Это @Query('search') в его коде
            params: {
                search: text
            },
            // Это @Body() в его коде.
            // Чтобы Axios отправил тело в GET, используем свойство data
            data: {
                page: page,
                sort: sort,
                categoryId: 1
            }
        });

        // В Flutter он получает объект DTO и берет данные оттуда
        // Судя по его коду, массив товаров лежит либо в .data, либо в .results
        return response.data?.data || response.data?.results || response.data;
    } catch (error) {
        console.error("Ошибка при поиске:", error);
        return [];
    }
};