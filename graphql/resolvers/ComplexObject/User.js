module.exports = {
  User: {
    __resolveType(obj, context, info) {
      if (obj.isTeacher) {
        return 'Teacher';
      }
      if (obj.isStudent) {
        return 'Student';
      }
      return null; // GraphQLError is thrown
    },
  }
}