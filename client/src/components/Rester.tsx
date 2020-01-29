import React, {useCallback, useState} from "react";
import axios from 'axios';

export const Rester: React.FC = () => {
    const [url, setUrl] = useState('http://localhost:3000/todo');
    const [method, setMethod] = useState<'get'|'post'|'put'|'delete'>('get');
    const [body, setBody] = useState('');
    const [result, setResult] = useState('');

    const handleMethodChange = useCallback(
        (event) => {
            setMethod(event.target.value);
        },
        [setMethod],
    );

    const handleUrlChange = useCallback(
        (event) => {
            setUrl(event.target.value);
        },
        [setUrl],
    );

    const handleBodyChange = useCallback(
        (event) => {
            setBody(event.target.value);
        },
        [setBody],
    );

    const handleSubmit = useCallback(
        (event) => {
            event.preventDefault();
            console.log(url, method, body);
            axios.request({
                method,
                url,
                data: body ? JSON.parse(body) : undefined,
            })
                .then(response => {
                    setResult(JSON.stringify(response.data));
                })
                .catch(console.log);
        },
        [url, method, body],
    );

    return (
        <div>
            <form onSubmit={handleSubmit}>
                Method:
                <select value={method} onChange={handleMethodChange}>
                    <option value='get'>GET</option>
                    <option value='post'>POST</option>
                    <option value='put'>PUT</option>
                    <option value='delete'>DELETE</option>
                </select>
                <br />
                Url:
                <input type="text" value={url} onChange={handleUrlChange} />
                <br />
                Body:
                <textarea onChange={handleBodyChange} value={body} />
                <br />
                <input type="submit" />
            </form>
            <div>
                {result}
            </div>
        </div>
    );
};
