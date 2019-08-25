// add correct ending to plural russian noun
export const pluralize = (noun, number) => {
  if (number === 1) {
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
  } else if (number === 0 || number > 4) {
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
  } else if (number > 1 || number < 5) {
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
    return ''
  }
};
