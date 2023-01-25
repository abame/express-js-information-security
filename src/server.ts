import * as dotenv from 'dotenv'
dotenv.config();
import express, { Request, Response } from "express";
import helmet from "helmet";
import mongoose from "mongoose";
import nocache from "nocache";
import { createVote, findVote, save } from './controller/database.js';
import bcrypt from "bcrypt";
import { hasIpVoted } from './controller/ip-vote.js';

const app = express();

app.use(helmet.hidePoweredBy()); //hide x-powered-by header
app.use(helmet.frameguard({ action: "deny" })); //no do allow execution of iframe
app.use(helmet.xssFilter()); //sanitize input sent to server
app.use(helmet.noSniff()); //set X-Content-Type-Options header to nosniff, instructing the browser to not bypass the provided Content-Type.
app.use(helmet.ieNoOpen()); //do not serve untrusted HTML
app.use(helmet.hsts({ maxAge: 90 * 24 * 60 * 60 })); //set header Strict-Transport-Security to instruct browser to use HTTPS for 90 days
app.use(helmet.dnsPrefetchControl()); //prefetch links in a page to increase performance
app.use(nocache()); //disable cache on users browser
app.use(helmet.contentSecurityPolicy({ directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] } }));

if (typeof process.env.CONNECTION_STRING !== "string") {
  throw new Error("MongoDB Connection string is not set or has wrong format");
}
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_STRING, {
  dbName: process.env.DB_NAME,
});

mongoose.connection
  .on('error', err => { console.error(err) })
  .once('open', () => {
    console.log('Connected to database');
  })

process.on('SIGNIT', () => {
  mongoose.connection.close(() => {
    console.log(`Closing connection to ${process.env.DB_NAME}`)
    process.exit(0)
  })
})

app.use(function (req: Request, res: Response, next) {
  res.set({
    "Access-Control-Allow-Origin": req.url,
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, content-type, Accept",
  });
  next();
});

app.get('/vote', async (req: Request, res: Response) => {
  const ip = await bcrypt.hash(req.ip, 13);
  const pollId = parseInt(req.query.pollId as string);
  const vote = await findVote(pollId) ?? createVote(1);
  const ipHasVoted = await hasIpVoted(req.ip, vote.ipAdresses);
  if (!ipHasVoted) {
    vote.votes++;
    vote.ipAdresses.push(ip);
  }
  await save(vote);
  res.json(vote);
});

app.use((_req: Request, res: Response) => {
  res.status(404).type("txt").send("Not Found");
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`)
});
