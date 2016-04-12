import Promise from 'bluebird';
import nconf from 'nconf';
import _request from 'request';
import R from 'ramda';

import sentry from '../../sentry';
import T from '../../translate';

let map = {}; //maps server to current question/answer TODO
const request = Promise.promisify(_request);
let answer;
function trivia(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('trivia_usage', msg.author.lang));
    return;
  }
  if(suffix === 'random') {
    // limit=1 will only return 1 gif

    const options = {
      url: 'http://jservice.io/api/random',
      json: true
    };

    request(options)
      .then(R.prop('body'))
      .then(body => {
        if (body[0].question) {
          bot.sendMessage(msg.channel, body[0].question);
          map[msg.channel] = body[0].answer;
          console.log(body[0].question);
        } else {
          bot.sendMessage(msg.channel, `${T('trivia_error', msg.author.lang)}: ${suffix}`);
        }
      })
      .catch(err => {
        sentry(err, 'trivia');
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  }

  else if(suffix.split(' ')[0] === 'answer'){
    //answer
    const userAnswer = suffix.substr(suffix.indexOf(' ') + 1);
    console.log('user answer: '+userAnswer);
    if(userAnswer === map[msg.channel]) {
      delete map[msg.channel];
      bot.sendMessage(msg.channel, 'Correct!');
    }
    else {
      bot.sendMessage(msg.channel, 'Incorrect');
    }
  }
  else if(suffix.split(' ')[0] === 'giveup') {
    bot.sendMessage(msg.channel, map[msg.channel]);
    delete map[msg.channel];
  }
}



export default {
trivia
};

export const help = {
  gif: {parameters: 'gif tags'}
};
