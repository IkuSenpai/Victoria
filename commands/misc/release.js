module.exports = {
  name: 'release',
  description: 'latest release information',
  execute(message) {
    const release =
      '```• Minor fix to phoenix timer    \n• Update sheets list```';
    const embed = {
      description: `${
        message.author
      } | Latest Release: [v1.4](https://github.com/Vexuas/yagi/releases)\n${release}`,
      color: 32896
    };
    message.channel.send({ embed });
  }
};