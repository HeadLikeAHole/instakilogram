import React from 'react';
import PropTypes from 'prop-types';


const NoPostsYet = props => {
  const noSavedPostsYet = (
    <div className="text-center">
      <i className="far fa-bookmark my-2 icon-large"></i>
      <h2 className="mb-3">Сохранить</h2>
      <p>
        Сохраняйте фото, которые хотите посмотреть снова. Они будут видны только вам.
      </p>
    </div>
  );

  const noPostsYet = (
    <div className="text-center">
      <i className="far fa-image my-2 icon-large"></i>
      <h2 className="mb-3">Публикации</h2>
      <p>
        Вы еще не добавили ни одной публикации.
      </p>
    </div>
  );

  return <>{props.savedPosts ? noSavedPostsYet : noPostsYet}</>
};


NoPostsYet.propTypes = {
  savedPosts: PropTypes.string
};


export default NoPostsYet;
