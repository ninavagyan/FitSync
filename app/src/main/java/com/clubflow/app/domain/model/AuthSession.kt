package com.clubflow.app.domain.model

data class AuthSession(
    val token: String,
    val userId: String,
    val fullName: String,
    val email: String,
)
