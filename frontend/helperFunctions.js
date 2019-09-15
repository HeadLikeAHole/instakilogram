// add correct ending to plural russian noun
export const pluralize = (noun, number) => {
  // match a number that is just one digit "1" or a number that ends in "1" excluding numbers ending in "11"
  const re1 = /\b1\b|[^1]1$/;

  // match a number that is just one digit from "2" to "4"
  // or a number that ends in digits from "2" to "4" excluding numbers ending in "12", "13", "14"
  const re2 = /\b[2-4]\b|[^1][2-4]$/;

  if (re1.test(number)) {
    switch (noun) {
      case 'like':
        return 'лайк';
      case 'comment':
        return 'комментарий';
      case 'reply':
        return 'ответ';
      case 'post':
        return 'публикация';
      case 'follower':
        return 'подписчик';
      case 'following':
        return 'подписка';
    }
  } else if (re2.test(number)) {
    switch (noun) {
      case 'like':
        return 'лайка';
      case 'comment':
        return 'комментария';
      case 'reply':
        return 'ответа';
      case 'post':
        return 'публикации';
      case 'follower':
        return 'подписчика';
      case 'following':
        return 'подписки';
    }
  } else {
    switch (noun) {
      case 'like':
        return 'лайков';
      case 'comment':
        return 'комментариев';
      case 'reply':
        return 'ответов';
      case 'post':
        return 'публикаций';
      case 'follower':
        return 'подписчиков';
      case 'following':
        return 'подписок';
    }
  }
};
