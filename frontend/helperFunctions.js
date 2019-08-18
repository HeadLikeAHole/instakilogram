// add correct ending to plural russian noun
export const pluralize = (noun, number) => {
  if (number === 1) {
    switch (noun) {
      case 'like':
        return 'лайк';
      case 'comment':
        return 'комментарий';
      case 'reply':
        return 'ответ'
    }
  } else if (number === 0 || number > 4) {
    switch (noun) {
      case 'like':
        return 'лайков';
      case 'comment':
        return 'комментариев';
      case 'reply':
        return 'ответов'
    }
  } else if (number > 1 || number < 5) {
    switch (noun) {
      case 'like':
        return 'лайка';
      case 'comment':
        return 'комментария';
      case 'reply':
        return 'ответа'
    }
  }
};
