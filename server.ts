import Koa from 'koa';
import dotenv from 'dotenv';
import next from 'next';
import createShopifyAuth, {verifyRequest} from '@shopify/koa-shopify-auth';
import session from 'koa-session';
import shopifyGraphQLProxy, {ApiVersion} from '@shopify/koa-shopify-graphql-proxy';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const { SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY } = process.env;

app.prepare().then(() => {
    const server = new Koa();

    server.use(session({ secure: true, sameSite: 'none'}, server));

    server.keys = [SHOPIFY_API_SECRET_KEY];

    server.use(
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: ['read_products'],
            afterAuth(ctx: Koa.Context): void {
                const { shop, accessToken } = ctx.session;
                ctx.cookies.set('shopOrigin', shop, {
                    httpOnly: false,
                    secure: true,
                    sameSite: 'none'
                });
                ctx.redirect('/');
            }
        })
    );

    server.use(shopifyGraphQLProxy({ version: ApiVersion.October20 }));
    server.use(verifyRequest());

    server.use(async (ctx: Koa.Context) => {
        await handle(ctx.req, ctx.res);
        ctx.respond = false;
        ctx.res.statusCode = 200;
    });

    server.listen(3000, () => {
        console.log('start');
    });
});
