<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];
    $subject = $_POST["subject"];


    $to = "njolayemi@gmail.com";
    
    $headers = "From: $email";

    // The email body
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    // Send email
    mail($to, $subject, $body, $headers);

    // alert the user to a thank you message
    echo '<script>alert("Thank you for reaching out to us! You are currently using our email form to share your thoughts or inquire about our services. We appreciate your time and look forward to assisting you.!");</script>';
}
?>
