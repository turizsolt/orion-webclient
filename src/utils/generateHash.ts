export const generateHash = () => {
    let result = '';
    for (let i = 0; i < 32; i += 1) {
        const char = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'][
            Math.floor(Math.random() * 16)
            ];
        result += char;
    }
    return result;
};
