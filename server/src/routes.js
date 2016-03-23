import Index from './index/index';
import Story from './story/story';

module.exports = {
  '/': Index,
  '/story/:storyId': Story
};
