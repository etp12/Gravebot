import Promise from 'bluebird';
import nconf from 'nconf';
import _request from 'request';
import R from 'ramda';

import sentry from '../../sentry';
import T from '../../translate';


const request = Promise.promisify(_request);
let answer;
function trivia(bot, msg, suffix) {
  if (!suffix) {
    bot.sendMessage(msg.channel, T('imgur_usage', msg.author.lang));
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
      //  if () {
          bot.sendMessage(msg.channel, body[0].question);
          answer = body[0].answer;
          console.log(body[0].question);
      //  } else {
        //  bot.sendMessage(msg.channel, `${T('gif_error', msg.author.lang)}: ${suffix}`);
      //  }
      })
      .catch(err => {
        sentry(err, 'gif', 'giphy');
        bot.sendMessage(msg.channel, `Error: ${err.message}`);
      });
  }

  else if(suffix.split(' ')[0] === 'answer'){
    //answer
    const userAnswer = suffix.split(' ')[1];
    console.log('user answer: '+userAnswer);
  }
}



export default {
trivia
};

export const help = {
  gif: {parameters: 'gif tags'}
};
