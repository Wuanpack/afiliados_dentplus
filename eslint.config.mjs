import love from 'eslint-config-love'

export default [
    {
        ...love,
        files: ['src/**/*.ts'],
        "rules": {
            "no-console": "off"
        }
    }
]