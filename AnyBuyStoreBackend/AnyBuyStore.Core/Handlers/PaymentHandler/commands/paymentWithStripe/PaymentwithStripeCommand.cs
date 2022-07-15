
using AnyBuyStore.Data.Data;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace AnyBuyStore.Core.Handlers.PaymentHandler.commands.paymentWithStripe
{
    public class PaymentwithStripeCommand : IRequest<bool>
    {
        public PaymentwithStripeCommand(PaymentModel @in)
        {
            In = @in;
        }
        public PaymentModel In { get; set; }
    }

    public class PaymentHandler : IRequestHandler<PaymentwithStripeCommand, bool>
    {
        private readonly DatabaseContext _context;
        private readonly IConfiguration _configuration;

        public PaymentHandler(DatabaseContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;

        }
        public async Task<bool> Handle(PaymentwithStripeCommand command, CancellationToken cancellationToken)
        {
            StripeConfiguration.SetApiKey("sk_test_51LLOM8SDnYiiSSr8ChYrlY4wbCqwIAibEgxuipG3lhRJOHMRfuJtHPD0SIf7GByNW45qSrkWnvcEXvtI4h5EApAv00C86TZUga");

            var customers = new CustomerService();
            var charges = new ChargeService();
            var customer = customers.Create(new CustomerCreateOptions
            {
               Email = command.In.CustomerEmail,
               Source = command.In.Id,
            });

            var charge = charges.Create(new ChargeCreateOptions
            {
                Amount = (long?)command.In.Amount,
                Description = "Customer Purchase",
                Currency = "INR",
                ReceiptEmail = command.In.CustomerEmail,
                Customer = customer.Id,
            });

            if(charge.Status == "succeeded")
            {
                return true;
            }
            else
            {
                return false;
            }
           
            //var options = new ChargeCreateOptions
            //{
            //    Amount = (long?)command.In.Amount,
            //    Currency = "INR",
            //    Description = "Customer Purchase",
            //    Source = command.In.Id,
            //  //  Customer = command.In.CustomerId,
            //    ReceiptEmail = command.In.CustomerEmail
            //};

            //var service = new ChargeService();
            //Charge charge = service.Create(options);
            //if (charge == null)
            //{
            //    return false;
            //}
            //else
            //    return true;

        }
    }
    public class PaymentModel
    {
        public string Id { get; set; }
        public  decimal Amount { get; set; }
        public string CustomerId { get; set; }
        public string CustomerEmail { get; set; }

    }

}
