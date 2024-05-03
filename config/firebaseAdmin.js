const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "dev-truth-417707",
  private_key_id: "da31fff659b391f7712108aee7add7113a370b66",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQD6ugcBAmHJmL5L\nyhUPVeoPHYXV574uB6tVMfUwyta90btCreZRN1Z2aC/RnW8oUDRN345OGof/deNf\noFR5qQjCTc2bXksTl0i9rlG09tAjJtsDRBU2mNtxdFoWIzWOS7hCz+mioJ2rGAeM\n12OhnmaUFVws1jo4VTiTOAvQz1AY61TSXShV256QVd3hkb0g/v0EuEYhCztH1V2k\nNIlvErlZbCQ+/RgEwlL4OXZO/Jjg0V4eIjKt7Aj1S/FM4xqdSR4GUnQBCAeFVKQz\nXHQSQxCwpae901PCZs7RSjMU6YjdZ7BUF0VM1ij24/CMKmzYqmJCtd7gkB2JXPVu\nYEo7BmEJAgMBAAECgf96QpF9FyxCobjUPDZeGVwzrVxrHMDKsUgFbdb3c/GYSNfc\n1ppOAC3+jyTCPNgh+vow/vzlbl/ishmtslYpp8Ny/CgbxbSBA8RKD4wdh5JMPHuP\nnCNmps2wWow96e1eSzi5W6kRzusTWHmrXrG2nbG82VhD2jLe8ATRGliopG7qYYpl\ngImMayzCS18g0+G+mB5ScvQ15vMwBNWbMkXbLzmRnUeqvlN+vIeYneTb4Ep7PnCZ\nJzHiG19RhnxW/M+RDZPqJ8J8YMlLgP7JXN2lCSWaaMPLvg5dPTSmLxzYZdmSJnv3\nBV2dboz68ndpR42C9XN0SJ1lYRo3Bm9HjkcwVxkCgYEA/nCeoR6Ch/H4Fx/fgbd+\nb8czhTeeTuUNtuvvp8S6jUwmlTkGypW7/cK7wX1xcUmBza9u0Q93anKmA3Y7ZHxu\nxnd2BydPyrXS4YzajlISWQvvzWgMezi+fMi4qTcxu5tbJO8U4yaXH3utm7adqjfK\npDm/1IUKXicujvbG/qsW6qUCgYEA/EOUSDkltCkyGfhQzTVB8Y5iWbS+SCSjYGV+\nNUvBnl+hd+NktuYuRXz3Z0hGJdUaaBVNnFUJHXeUN0IIIP9LhRUMQoVbZXhwauYH\nkPjJlS3+lTcAOmmbh+xtHR3z5e5PbA4vKdE21g0pHGM6zf6AHkGPBTQ6jqf8iLR0\n8omKY5UCgYEAv5WHLCRv/vMIbkkWn3LOJlZlCcMmVZuNJxYiXz33hhs31haZcYMr\niVjOzVOqTrYdogWduJcfwKxRKrwk3nX/ZzteSOal4ynjfufzTUSpAhnF1/GnrES+\n0fDFcszXir7g8z9+h8dv9UnIID5yG1BlKiE9u0Tt2JVCLm3MyseCuu0CgYEAssd6\nGU1W6T2g4kLXkPdDitvr28N6b0p39uM29LKBv6nqlzqyr+Slul18QNg5zqoektE2\nNasWUKnkgtzrQedsMB7gl2xHf7xBf6ESj62hv3XfTQSzxrH9pfDqy43kwnmIE/5h\ncnNxN3YQQqwYitDpH4g6wedn8J4hHQk3MIRFbZkCgYBU//Vdkg2FvSEgRB7jezjq\nrWMYTnO3IMSL4x2KJSvNhZ7oVM2SiBg5adegSQNzN/fMqaO5WKe9rQDay/OXAeCp\nnRjXNf48OE+ZhGGpAH+dDws9bQGbBwXMw1FxVfI3ax0kF9NcGpQvSToqnGApb8Ea\nTtD9o+IwcDW+VQzYXd0YEw==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-2r5qp@dev-truth-417707.iam.gserviceaccount.com",
  client_id: "113421843629423617466",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2r5qp%40dev-truth-417707.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://dev-truth-417707.appspot.com",
});

module.exports = admin;
